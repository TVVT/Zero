$(function() {
    //二维码加载好之后开启webSocket
    var qrCodeImg = document.getElementById('qrCodeImg');
    qrCodeImg.onload = function() {
        var ws = new WebSocket("ws://localhost:8081");

        ws.onopen = function(e) {
            console.log("连接成功。。。");
            ws.send(JSON.stringify({
                cid: $('#qrCodeImg').attr('qrCode')
            }));
        };

        ws.onmessage = function(event) {
            var data = JSON.parse(event.data);

            if (data && data.status === 'ready') {
                var $div = $('<div class="feedback_box"></div>');

                $div.html('你的手机环境为：');
                var ua_span = $('<span>'+data['user-agent']+'</span>');

                var status = $('<div class="status"></div>');
                var btn_ok = $('<a href="javascript:;" class="ok">一切ok</a>');
                var btn_error = $('<a href="javascript:;" class="warning">反馈一个问题?</a>');

                status.append(btn_ok,'，',btn_error);

                var $form = $('<div class="form">' +
                                '<form>' +
                                    '<textarea placeholder="请描述一下你的问题...."></textarea>' +
                                    '<input type="submit" value="提交" />' +
                                '</form>' +
                            '</div>');

                $div.append(ua_span,status,$form);

                $('.page-feedback').append($div);

                $div.addClass('show');

                btn_ok.on('click',function(){
                    status.html('thanks!');
                    $form.remove();
                });

                btn_error.on('click',function(){
                    $form.toggleClass('show');
                    // todo useing ajax here..
                });



            };
        }

    }


    $('#showQrCode').on('click',function(){
        $('.manager-page-qrcode').toggleClass('show');
    });

    $('#showModules').on('click',function(){
        $('.manager-page-modules').toggleClass('show');
    });

    $('.board .close').on('click', function() {
        $('.board').removeClass('show');
    });


})