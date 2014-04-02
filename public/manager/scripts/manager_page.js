$(function() {


	//二维码加载好之后开启webSocket
	document.getElementById('qrCodeImg').onload = function() {
		var ws = new WebSocket("ws://localhost:8081");

		ws.onopen = function(e) {
			alert("开始连接...");
			ws.send(JSON.stringify({
				cid: $('#qrCodeImg').attr('qrCode')
			}));
		};

		ws.onmessage = function(event) {
			alert(event.data);
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