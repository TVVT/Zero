// manager_page_home.js

$(function() {
    var left = 0,
        prevP = 0,
        tagData;

    $('.iframe-wrapper').on('click', function() {
        if ($(this).attr('data-href')) {
            window.location.href = $(this).attr('data-href');
        }
    });

    var href = window.location.href,
        group = href.split('/'),
        projectName = group[group.length - 2],
        $tagListBox = $('.manager-page-tags'),
        pageList = $('.manager-page-list').children();

    $.ajax({
        url: '/tags',
        method: 'GET',
        data: {
            'projectName': projectName
        },
        success: function(data) {
        	console.log(data)
            tagData = data;

            if(data.tags ){
                data.tags.forEach(function(value, index) {
                    var a = $('<a class="tag" data-name="' + data[value] + '" href="#' + value + '">' + value + '</a>')
                    $tagListBox.append(a);
                    a.on('click', function() {
                        pageList.hide();
                        a.attr('data-name').split(',').forEach(function(pageName, index) {
                            pageList.each(function(index) {
                                if ($(pageList[index]).attr('data-name') === pageName) {
                                    $(pageList[index]).show();
                                };
                            })
                        })
                    })
                });
            }


            if (window.location.hash) {
                var tagName = window.location.hash.substring(1);
                pageList.hide();
                tagData[tagName].forEach(function(pageName, index) {
                    pageList.each(function(index) {
                        if ($(pageList[index]).attr('data-name') === pageName) {
                            $(pageList[index]).show();
                        };
                    })
                })
            }

        }
    });

    //event.preventDefault();
    $('.mod_tags').on('click' , function(event){
        event.stopPropagation();
    });
});
