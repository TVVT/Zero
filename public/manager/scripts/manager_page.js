$(function() {
    //二维码加载好之后开启webSocket
    var qrCodeImg = document.getElementById('qrCodeImg');
    var url = 'http://192.168.112.117:3000/feedBack';
    qrCodeImg.onload = function() {
        var ws = new WebSocket("ws://192.168.112.117:8081");

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
                var ua_span = $('<span class="user-agent">'+data['user-agent']+'</span>');

                var status = $('<div class="status"></div>');
                var btn_ok = $('<a href="javascript:;" class="ok">一切ok</a>');
                var btn_error = $('<a href="javascript:;" class="warning">反馈一个问题?</a>');

                status.append(btn_ok,'，',btn_error);

                var $form = $('<div class="form">' +
                                '<form id="feedBackForm">' +
                                    '<textarea name="feedback" placeholder="请描述一下你的问题...."></textarea>' +
                                    '<input id="feedBackSubmit" type="submit" value="提交" />' +
                                '</form>' +
                            '</div>');

                $div.append(ua_span,status,$form);

                $('.page-feedback').append($div);

                $div.addClass('show');

                btn_ok.on('click',function(){
                    var formData = new FormData();
                    formData.append('projectName',document.body.getAttribute("project-name"));
                    formData.append('pageName',document.body.getAttribute('page-name'));
                    formData.append('clientInfo',document.querySelector('.user-agent').innerText);
                    formData.append('isOK','true');

                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function(){
                        if(xhr.readyState === 4){
                            //success here
                            
                        }
                    };
                    // alert(url)
                    xhr.open('POST',url,true);
                    xhr.send(formData);


                    status.html('thanks!');
                    $form.remove();
                });

                btn_error.on('click',function(){
                    $form.toggleClass('show');

                    feedBackSubmit.onclick = function(e){
                        var feedBackForm = document.querySelector('#feedBackForm'),
                        feedBackSubmit = document.querySelector('#feedBackSubmit');
                        var formData = new FormData(feedBackForm);
                        formData.append('projectName',document.body.getAttribute("project-name"));
                        formData.append('pageName',document.body.getAttribute('page-name'));
                        formData.append('clientInfo',document.querySelector('.user-agent').innerText);
                        formData.append('isOK','false');
                        var xhr = new XMLHttpRequest();
                        xhr.onreadystatechange = function(){
                            if(xhr.readyState === 4){
                                                       
                            }
                        };
                        xhr.open('POST',url,true);
                        xhr.send(formData);
                        status.html('thanks!');
                        $form.remove();
                        return false;
                    }
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

    $('#showSource').on('click',function(){
        $('.page-data-board').removeClass('show');
        $('.page-source-board').toggleClass('show');
    })

    $('#pageData').on('click',function(){
        $('.page-source-board').removeClass('show');
        $('.page-data-board').toggleClass('show');
    })

    $('#pageInfo').on('click',function(){
        $('.manager-page-info').toggleClass('show');
    })

    $('.board .close').on('click', function() {
        $('.board').removeClass('show');
    });


})