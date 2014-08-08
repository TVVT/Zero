$(function() {
    var collect = $('.manager_projects_list'),
        iframeContent = $('.iframeContent'),
        isLocalStorage = window.localStorage ? true : false,
        projectList = new Array();

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

    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < projectList.length; i++) {
            if (projectList[i] == val) return i;
        }
        return -1;
    };
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
        var id = $(this).attr('id');
        if (isRepeat(id)) {
            projectList.push(id);
        }
        if (isLocalStorage) {
            localStorage.setItem('projectList', projectList);
        }
        //debugger
        if ($(this).hasClass('sed')) {
            $(this).removeClass('sed');
            projectList.remove(id);
        } else {
            $(this).addClass('sed');
        }

        console.log(projectList);
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

});
