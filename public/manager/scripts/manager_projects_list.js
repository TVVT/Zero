/**
 * [manager_projects_list 功能控制]
 * @return {[type]} [description]
 */
$(function() {
    /**
     * [collect 参数初始化]
     * @type {[type]}
     */
    var collect = $('.manager_projects_list'),//整个列表对象
        iframeContent = $('.iframeContent'),//右边出来的iframe
        manager_close = $('.manager_close'),//关闭按钮
        isLocalStorage = window.localStorage ? true : false,//是否支持localStorage
        projectList = new Array(),//声明一个商品空数组对象
        iframeUrl;//iframe src 的过渡变量
    /**
     * [列表存储]
     * @return {[type]} [description]
     */
    (function() {
        if (!localStorage.getItem('projectList')) {
            return;
        }
        var le = localStorage.getItem('projectList').split(','),
            i = 0;
        while (i < le.length) {
            projectList.push(le[i]);
            i++;
        }
    })();
    /**
     * [收藏图标样式控制]
     * @return {[type]} [description]
     */
    (function() {
        var le = collect.find('.project-wrapper .collect');
        for (var i = 0; i < projectList.length; i++) {
            for (var j = 0; j < le.length; j++) {
                if (projectList[i] == le[j].id) {
                    $(le[j]).addClass('sed')
                    $(le[j]).parents('.project-wrapper').prependTo(collect);
                }
            }
        };
    })();
    /**
     * [避免重复]
     * @param  {[type]}  id [传入的ＩＤ]
     * @return {Boolean}    [返回的值是bool类型]
     */
    function isRepeat(id) {
        if (projectList.length <= 0) {
            return true;
        }
        for (var i = 0, k = projectList.length; i < k; i++) {        
            if (id === projectList[i]) {            
                return false;           
            }   
        }    
        return true;
    }
    /**
     * [查找索引]
     * @param  {[type]} val [对象]
     * @return {[type]}     [数字]
     */
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < projectList.length; i++) {
            if (projectList[i] == val) return i;
        }
        return -1;
    };
    /**
     * [删除指定的对象]
     * @param  {[type]} val [对象]
     */
    Array.prototype.remove = function(val) {
        var index = projectList.indexOf(val);
        if (index > -1) {
            projectList.splice(index, 1);
        }
    };
    /**
     * [收藏]
     * @param  {[type]} event [description]
     * @return {[type]}       [没有返回值]
     */
    collect.on('click', '.collect', function(event) {
        event.preventDefault();
        var id = $(this).attr('id'),
            parentDom = $(this).parents('.project-wrapper'),
            l = parentDom.offset().left,
            t = parentDom.offset().top - 45;

        //判断ＩＤ是否重复
        if (isRepeat(id)) {
            projectList.push(id);
        }

        //debugger
        if ($(this).hasClass('sed')) {
            $(this).removeClass('sed');
            parentDom.stop().animate({
                'opacity': 0
            }, 1000, function() {
                collect.append(parentDom);
                parentDom.animate({
                    'opacity': 1
                }, 500);
            });
            projectList.remove(id);

        } else {
            parentDom.clone().addClass('zhan').insertBefore(parentDom);
            parentDom.css({
                'left': l,
                'top': t
            });

            $('.fixedLayer').append(parentDom).addClass('show');

            $('.manager_projects_list').animate({
                scrollTop: 0
            }, 1000, function() {

                parentDom.css({
                    left: 35,
                    top: 0
                });
                collect.find('.zhan').remove();

                setTimeout(function() {
                    parentDom.css({
                        left: 0,
                        top: 0
                    });
                    parentDom.find('.collect').addClass('sed');
                    $('.fixedLayer').removeClass('show');
                    parentDom.prependTo($('.manager_projects_list'));
                }, 1000);

            });
        }

        if (isLocalStorage) {
            localStorage.setItem('projectList', projectList);
        }
    });
    /**
     * [openIframeContent 打开弹出]
     * @param  {[String]} url [iframe 的 url]
     */
    function openIframeContent(url) {
        var ifr = iframeContent.find('iframe');

        if (!iframeContent.hasClass('show')) {
            iframeContent.addClass('show');
            collect.addClass('show');
        } else {
            IframeUrlFun(ifr);
        }
    }
    /**
     * [IframeUrlFun 给iframeUrl赋值]
     * @param {[type]} obj [iframe对象]
     */
    function IframeUrlFun(obj) {
        obj.attr('src', iframeUrl).css({
            'height': iframeContent.height() + 'px'
        });
    }
    /**
     * [IframeShow 找到iframe看有没有show，有就添加src]
     */
    function IframeShow() {
        var ifr = iframeContent.find('iframe');
        if (this.classList.contains('show')) {
            IframeUrlFun(ifr);
        }
    }
    /**
     * [内容页的控制]
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    collect.on('click', 'img', function(event) {
        var url = $(this).attr('data-url');
        iframeUrl = url;
        openIframeContent(url);
    });
    /**
     * [监听动车结束]
     * @return {[type]} [description]
     */
    iframeContent[0].addEventListener('webkitTransitionEnd', IframeShow, function() {
        IframeShow();
    }, false);
    /**
     * [左边关闭按钮的控制]
     * @return {[type]} [description]
     */
    iframeContent.on('click', 'i', function() {
        if (collect.hasClass('show')) {
            iframeContent.removeClass('show');
            collect.removeClass('show').removeClass('hide');
            iframeContent.find('iframe').attr('src', '');
        }
    });
    /**
     * [右边关闭按钮的控制]
     * @return {[type]} [description]
     */
    manager_close.on('click', 'i', function() {
        if (iframeContent.find('iframe').attr('src') === '') {
            return;
        }
        if (collect.hasClass('hide')) {
            collect.removeClass('hide');
        } else {
            collect.addClass('hide');
        }
    });
    /**
     * [搜索文件]
     * @return {[type]} [description]
     */
    (function(){
        var searchFile={};
        searchFile.init=function(){
            searchFile.ininAllFileName();
        };
        /**
         * [ininAllFileName 加载所有文件名]
         * @return {[type]} [description]
         */
        searchFile.ininAllFileName=function(){

        };
    })();
});
