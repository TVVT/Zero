$(function() {

    //二维码加载好之后开启webSocket
    var qrCodeImg = document.getElementById('qrCodeImg'),
        host = window.location.hostname;
    var href = window.location.href;
    var curPage = href.slice(href.lastIndexOf('/') + 1, href.length);
    var url = 'http://' + host + ':3000/feedBack';

    if (localStorage.cid) {
        $.ajax({
            type: "POST",
            url: 'http://' + host + ':3000/checkWs',
            data: {
                cid: localStorage.cid
            },
            success: function(data) {
                if (data.hasWs) {
                    var src = $('#qrCodeImg').attr('src');
                    src = src.slice(0,src.lastIndexOf('=')+1) + localStorage.cid;
                    $('#qrCodeImg').attr('src',src);
                } else {
                    localStorage.cid = $('#qrCodeImg').attr('qrCode');
                }
                ws();
            }
        })
    } else {
        localStorage.cid = $('#qrCodeImg').attr('qrCode');
    }

    // qrCodeImg.onload = function() {

    function ws() {
        var ws = new WebSocket('ws://' + host + ':8081');

        ws.onopen = function(e) {
            console.log("连接成功。。。");
            ws.send(JSON.stringify({
                cid: localStorage.cid,
                isClient: false
            }));

            if (window.localStorage) {
                if (localStorage.cid) {
                    $.ajax({
                        type: 'POST',
                        url: 'http://' + host + ':3000/changeCurPage',
                        data: {
                            cid: localStorage.cid,
                            curPage: curPage
                        },
                        success: function() {
                            console.log('页面切换成功！');
                        }
                    })
                };
            };
        };

        ws.onmessage = function(event) {
            var data = JSON.parse(event.data);

            if (data && data.status === 'ready') {

                var $div = $('<div class="feedback_box"></div>');

                $div.html('你的手机环境为：');
                var ua_span = $('<span class="user-agent">' + data['user-agent'] + '</span>');

                var status = $('<div class="status"></div>');
                var btn_ok = $('<a href="javascript:;" class="ok">一切ok</a>');
                var btn_error = $('<a href="javascript:;" class="warning">反馈一个问题?</a>');

                status.append(btn_ok, '，', btn_error);

                var $form_box = $('<div class="form">' +
                    '<form class="feedBackForm">' +
                    '<textarea name="feedback" placeholder="请描述一下你的问题...."></textarea>' +
                    '<input class="feedBackSubmit" type="submit" value="提交" />' +
                    '</form>' +
                    '</div>');

                $div.append(ua_span, status, $form_box);

                $('.page-feedback').append($div);

                $div.addClass('show');

                btn_ok.on('click', function() {
                    var formData = new FormData();
                    formData.append('projectName', document.body.getAttribute("project-name"));
                    formData.append('pageName', document.body.getAttribute('page-name'));
                    formData.append('clientInfo', ua_span.html());
                    formData.append('isOK', 'true');

                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            //success here
                            status.html('thanks!');
                            $form_box.remove();
                        }
                    };
                    // alert(url)
                    xhr.open('POST', url, true);
                    xhr.send(formData);

                });

                btn_error.on('click', function() {
                    $form_box.toggleClass('show');
                });


                var feedBackSubmit = $form_box.find('.feedBackSubmit'),
                    _form = $form_box.find('form')[0];

                feedBackSubmit.on('click', function(e) {
                    e.preventDefault();
                    var formData = new FormData(_form);
                    formData.append('projectName', document.body.getAttribute("project-name"));
                    formData.append('pageName', document.body.getAttribute('page-name'));
                    formData.append('clientInfo', ua_span.html());
                    formData.append('isOK', 'false');
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            status.html('thanks!');
                            $form_box.remove();
                        }
                    };
                    xhr.open('POST', url, true);
                    xhr.send(formData);
                });
            };
        }

        // } 

        $('#showQrCode').on('click', function() {
            $('.manager-page-qrcode').toggleClass('show');
        });

        $('#showSource').on('click', function() {
            $('.page-data-board').removeClass('show');
            $('.page-source-board').toggleClass('show');
        })

        $('#pageData').on('click', function() {
            $('.page-source-board').removeClass('show');
            $('.page-data-board').toggleClass('show');
        })

        $('#pageInfo').on('click', function() {
            $('.manager-page-info').toggleClass('show');
        })

        $('.board .close').on('click', function() {
            $('.board').removeClass('show');
        });

        $('.manager-page-show .tags li').on('mouseenter', function() {
            // $('.manager-page-show .tags li').removeClass('ac');
            var size = $(this).attr('data-size');
            var w = size.split('x')[0];
            var h = size.split('x')[1];
            $('#iframe-wrapper').css({
                width: w,
                height: h
            });
        }).on('mouseleave', function() {
            var size = $('.manager-page-show .tags li.ac').attr('data-size');
            if (size) {
                var w = size.split('x')[0];
                var h = size.split('x')[1];
                $('#iframe-wrapper').css({
                    width: w,
                    height: h
                });
            } else {
                $('#iframe-wrapper').css({
                    width: 320,
                    height: 480
                });
            }
        }).on('click', function() {
            $('.manager-page-show .tags li').removeClass('ac');
            $(this).addClass('ac');
        });


    }


})
