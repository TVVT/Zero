/**
 * [manager_projects_list 功能控制]
 * @return {[type]} [description]
 */
$(function() {
    function isFullScreen() {
        return (document.fullScreenElement && document.fullScreenElement !== null) || document.mozFullScreen || document.webkitIsFullScreen;
    }

    function requestFullScreen(element) {
        if (element.requestFullscreen)
            element.requestFullscreen();
        else if (element.msRequestFullscreen)
            element.msRequestFullscreen();
        else if (element.mozRequestFullScreen)
            element.mozRequestFullScreen();
        else if (element.webkitRequestFullscreen)
            element.webkitRequestFullscreen();
    }

    function exitFullScreen() {
        if (document.exitFullscreen)
            document.exitFullscreen();
        else if (document.msExitFullscreen)
            document.msExitFullscreen();
        else if (document.mozCancelFullScreen)
            document.mozCancelFullScreen();
        else if (document.webkitExitFullscreen)
            document.webkitExitFullscreen();
    }

    function toggleFullScreen(element) {
        if (isFullScreen())
            exitFullScreen();
        else
            requestFullScreen(element || document.documentElement);
    }
    var $icon_list = document.querySelector('.icon_list:nth-of-type(2)');
    var $iframeContent = document.querySelector('.iframeContent');
    if ($icon_list && $iframeContent) {
        $icon_list.addEventListener('click', function() {
            toggleFullScreen($iframeContent);
        }, false);
    }
    /**
     * [collect 参数初始化]
     * @type {[type]}
     */
    var collect = $('.manager_projects_list'), //整个列表对象
        iframeContent = $('.iframeContent'), //右边出来的iframe
        isLocalStorage = window.localStorage ? true : false, //是否支持localStorage
        projectList = new Array(), //声明一个商品空数组对象
        iframeUrl; //iframe src 的过渡变量
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
                    $(le[j]).removeClass('icon-heart2').addClass('sed icon-heart');
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
        if ($(this).hasClass('icon-heart')) {
            $(this).removeClass('icon-heart').addClass('icon-heart2');
            parentDom.stop().animate({
                'opacity': 0
            }, 500, function() {
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
            }, 500, function() {
                collect.find('.zhan').remove();
                parentDom.animate({
                    left: 10,
                    top: 0
                }, 800, function() {
                    parentDom.animate({
                        left: 0,
                        top: 0
                    }, 500, function() {
                        parentDom.css({
                            left: '',
                            top: ''
                        });
                        parentDom.prependTo($('.manager_projects_list'));
                        parentDom.find('.collect').removeClass('icon-heart2').addClass('icon-heart');
                        $('.fixedLayer').removeClass('show');
                    });
                });
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
        obj.attr('src', iframeUrl);
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

        collect.find('.project-wrapper').removeClass('selected');
        $(this).parents('.project-wrapper').addClass('selected');
    });
    /**
     * [监听动结束]
     * @return {[type]} [description]
     */
    iframeContent[0].addEventListener('webkitTransitionEnd', IframeShow, function() {
        IframeShow();
    }, false);
    /**
     * [右边关闭按钮的控制]
     * @return {[type]} [description]
     */
    iframeContent.on('click', 'i:nth-of-type(1)', function() {
        if (collect.hasClass('show')) {
            iframeContent.removeClass('show');
            collect.removeClass('show').removeClass('hide');
            iframeContent.find('iframe').attr('src', '');
            collect.find('.project-wrapper').removeClass('selected');
            if (isFullScreen()) {
                exitFullScreen();
            }
        }
    });
    /**
     * [搜索文件]
     * @return {[type]} [description]
     */
    (function() {
        var searchFile = {
            input_append: $('.input-append'),
            temp: ''
        };
        /**
         * [ininAllFileName 加载所有文件名]
         * @return {[type]} [description]
         */
        searchFile.ininAllFileName = function() {
            var flag = false;
            $.ajax({
                type: 'GET',
                async: false,
                url: '/manager/scripts/project_manager.json',
                dataType: "json",
                success: function(resultData) {
                    flag = resultData.file_every;
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert(errorThrown);
                    flag = '';
                }
            });
            return flag;
        };
        /**
         * [compreFile 匹配相似的文件]
         * @param  {[type]} file [文件名]
         * @return {[type]}      [文件组]
         */
        searchFile.compreFile = function(fileName) {
            var arry = new Array(),
                data = null;

            if (typeof(searchFile.temp) === 'string' && searchFile.temp === '') {
                data = searchFile.ininAllFileName();
                searchFile.temp = data;
            } else {
                data = searchFile.temp;
            }

            for (var i = 0; i < data.length; i++) {
                if (data[i].title.indexOf(fileName) > -1) {
                    arry.push({
                        'title': data[i].title,
                        'link': data[i].link
                    });
                }
            }
            return arry;
        };

        /**
         * [input搜索框点击进入打开下拉层]
         */
        searchFile.input_append.on('focus', '.input-mini', function() {
            $('header blockquote').addClass('show');
            $(this).next('section').addClass('show');
        });
        $('header').on('click', 'blockquote', function() {
            $(this).removeClass('show');
            $('header').find('section').removeClass('show');
        });
        /**
         * [插入数据时，事件控制]
         */
        searchFile.input_append.on('keydown', '.input-mini', function(e) {
            var fileName = $(this).val().toString().replace(/(^\s+)|(\s+$)/g, ""), //去掉前后空格
                htmlData = searchFile.compreFile(fileName),
                htmlC = '',
                linkC = 'Projects/',
                article = $(this).next('section').find('article');

            for (var i = 0; i < htmlData.length; i++) {
                htmlC += '<a href="' + htmlData[i].link + '" target="_blank" >',
                htmlC += '<span>' + htmlData[i].title + '</span>',
                htmlC += '<span>' + htmlData[i].link + '</span>', //htmlData[i].link.toString().replace(/http:\/\/\d{3}\.\d{3}\.\d{1,3}\.\d{1,3}:?\d{0,}/,linkC)
                htmlC += '</a>';
            }

            article.html('');
            article.append(htmlC);

            //enter时，跳转页面
            var ev = e || window.event;
            if (ev.keyCode === 13 && fileName.length > 0) {
                document.location.href = fileName;
                document.location.target = _blank;
            }
        });
        /**
         * [下拉层的点击事件]
         * @return {[type]} [description]
         */
        searchFile.input_append.find('article').on('click', 'a', function() {
            searchFile.input_append.find('.input-mini').val($(this).attr('href'));
            $('header').find('blockquote').removeClass('show');
            $('header').find('section').removeClass('show');
        });

        searchFile.init = function() {
            searchFile.ininAllFileName();
        };
        searchFile.init();
    })();
});
