(function(window) {
	console.log(window.location.href)
	var host = window.location.hostname;
    var ws = new WebSocket('ws://' + host + ':8081');
    var href = window.location.href;
        var cid = href.slice(href.lastIndexOf('=')+1,href.length)+'m';
    ws.onopen = function(e) {
        ws.send(JSON.stringify({
            cid: cid
        }));
    };
     ws.onmessage = function(event) {
     	var curPage = JSON.parse(event.data);
     	window.location.href='http://'+host+':3000/'
     }

})(window)
