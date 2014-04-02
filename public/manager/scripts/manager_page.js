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
				$('.page-feedback').css('display','block');
				$('.user-agent').text(data['user-agent']);
			};
		}
	}

	// $('#nav li').on('click', function(e) {
	// 	$('.board').children().hide();
	// 	$('.board .close').show();
	// 	$('.board').toggleClass('show');

	// 	switch (e.target.id.toString()) {
	// 		case 'showQrCode':
	// 			$('.board .qrCode').show();
	// 			break;
	// 		case 'showSource':
	// 			$('.board .page-source').show();
	// 			break;
	// 		default:
	// 	}
	// })

	$('#showModules').on('click',function(){
		$('.manager-page-modules').toggleClass('show');
	})

	$('.board .close').on('click', function() {
		$('.board').removeClass('show');
	})

})