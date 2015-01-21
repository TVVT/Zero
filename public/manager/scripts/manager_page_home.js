// manager_page_home.js
$(function(){
    var left = 0,
        prevP = 0,
        tagData;

    var doc = document;


    var getPapa = function(dom,className) {
        if(!dom || dom.nodeType !== 1){return;}
        if(dom.className === className ){
            return dom;
        }else{
            return getPapa(dom.parentNode,className);
        }
    }

    doc.addEventListener('click', function(e) {
        var target = e.target;
        var papa = getPapa(target,'iframe-wrapper');
        if(!papa){return;}
        if(papa.getAttribute('data-href')){
            window.location.href = target.getAttribute('data-href');
        }
    });


    var _list = doc.querySelector('.manager-page-list');
    var _ifs;

    var scrollTimer;

    var scollList = function(){
        if(scrollTimer){
            clearTimeout(scrollTimer);
            scrollTimer = null;
        }

        scrollTimer = setTimeout(function(){
            var _top = _list.scrollTop;
            var _height = _list.clientHeight;
            var _sHeight = _list.scrollHeight; 

            _ifs = _list.querySelectorAll('.iframe-wrapper[data-src]');

            for(var n = 0 ; n< _ifs.length ; n++){
                var _if = _ifs[n];
                var _t = _if.offsetTop;
                if(_t > _top && _t < _top + _height){
                    var _src = _if.getAttribute('data-src');
                    _if.querySelector('iframe').setAttribute('src',_src);
                    _if.removeAttribute('data-src');
                }
            }
        },50);

    }

    doc.querySelector('.manager-page-list').addEventListener('scroll',scollList);

    scollList();


    // zjj
    $('.mod_tags , .select_more').on('click' , function(event){
        event.stopPropagation();
    });

    /**
     * [$modTags 添加、删除tag]
     */
    var $modTags = $('.mod_tags'),
        $label = $modTags.find('label'),
        $iconDelete = $('.icon_delete'),
        $iconAdd = $('.icon_add'),_this;

    $iconAdd.on('click' , function(e){
        addInput(e);
    });

    $modTags.on('click' , '.icon_delete' , function(event){
        deleteInput(event);

    });

    function addInput(e){
        var _this = e.target;
        $(_this).before('<label><input type="text" placeholder="关键字" /><i class="icon_delete">--</i></label>');
    }

    function deleteInput(e){
        var _this = e.target;
        $(_this).parents('label').remove();
    }




});



    // var href = window.location.href,
    //     group = href.split('/'),
    //     projectName = group[group.length - 2],
    //     $tagListBox = $('.manager-page-tags'),
    //     pageList = $('.manager-page-list').children();
    // $.ajax({
    //     url: '/tags',
    //     method: 'GET',
    //     data: {
    //         'projectName': projectName
    //     },
    //     success: function(data) {
    //     	console.log(data)
    //         tagData = data;

    //         if(data.tags ){
    //             data.tags.forEach(function(value, index) {
    //                 var a = $('<a class="tag" data-name="' + data[value] + '" href="#' + value + '">' + value + '</a>')
    //                 $tagListBox.append(a);
    //                 a.on('click', function() {
    //                     pageList.hide();
    //                     a.attr('data-name').split(',').forEach(function(pageName, index) {
    //                         pageList.each(function(index) {
    //                             if ($(pageList[index]).attr('data-name') === pageName) {
    //                                 $(pageList[index]).show();
    //                             };
    //                         })
    //                     })
    //                 })
    //             });
    //         }

    //         if (window.location.hash) {
    //             var tagName = window.location.hash.substring(1);
    //             pageList.hide();
    //             tagData[tagName].forEach(function(pageName, index) {
    //                 pageList.each(function(index) {
    //                     if ($(pageList[index]).attr('data-name') === pageName) {
    //                         $(pageList[index]).show();
    //                     };
    //                 })
    //             })
    //         }

    //     }
    // })

    
