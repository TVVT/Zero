// TODO 长连接的关闭和清理
var webSocketServer = require('ws').Server,
	wss = wss ? wss : new webSocketServer({
		port: 8081
	}),
	wsGroup = {}; //ws连接池


//建立webSocket服务器
wss.on('connection', function(ws) {
	console.log("connected!");
	ws.on('message', function(message) {
		var msg = JSON.parse(message);
		wsGroup[msg.cid] = ws;
	});
});

wss.on('close', function(data) {
	console.log(data);
    console.log('disconnected');
});

exports.send = function(cid, data) {
	if (wsGroup[cid]) {
		try{
			wsGroup[cid].send(data);
		}catch(e){
			delete wsGroup[cid];
			console.error(e);
		}
	}else{
		console.log("没有"+cid+"的这个ws实例");
	}
}
exports.wsGroup = wsGroup;