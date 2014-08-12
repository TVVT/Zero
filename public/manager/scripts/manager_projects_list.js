$(function() {
    var collect = $('.manager_projects_list'),
        iframeContent = $('.iframeContent'),
        isLocalStorage = window.localStorage ? true : false,
        projectList = new Array();

    (function() {
    	if(!localStorage.getItem('projectList')){
    		return;
    	}
        var le = localStorage.getItem('projectList').split(','),
            i = 0;
        while (i < le.length) {
            projectList.push(le[i]);
            i++;
        }
    })();

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
    //查找索引
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < projectList.length; i++) {
            if (projectList[i] == val) return i;
        }
        return -1;
    };
    //remove
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
            ind = $(this).index(),
            zhan = collect.find('.zhan'),
            l = parentDom.offset().left,
            t = parentDom.offset().top - 45;

        //判断ＩＤ是否重复
        if (isRepeat(id)) {
            projectList.push(id);
        }

        //debugger
        if ($(this).hasClass('sed')) {
            $(this).removeClass('sed');
            parentDom.stop().animate({'opacity':0},1000,function(){
            	collect.append(parentDom);
            	parentDom.animate({'opacity':1},500);
            });
            projectList.remove(id);
           
        } else {
            collect.find('.zhan').insertBefore(parentDom);
            collect.find('.zhan').addClass('show').css({
                'left': l,
                'top': t
            });
            parentDom.css({
                'left': l,
                'top': t
            });

            $('.fixedLayer').append(parentDom).addClass('show');

            $('.manager_projects_list').animate({
                scrollTop: 0
            }, 1000, function() {

                parentDom.css({
                    left: l,
                    top: 0
                });
                collect.find('.zhan').removeClass('show');
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
     * [内容页的控制]
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    collect.on('click', 'img', function(event) {
        var a = $(this).attr('data-url'),
            ifr = iframeContent.find('iframe');

        ifr.attr('src', a).css({
            'height': iframeContent.height() + 'px'
        });
        if (iframeContent.hasClass('show')) {
            return;
        }
        iframeContent.addClass('show');
        collect.addClass('show');
    });

    iframeContent.on('click', 'i', function() {
        iframeContent.removeClass('show');
        collect.removeClass('show');
    });

});
