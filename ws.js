//单例的ws

var webSocketServer = require('ws').Server,
	wss = new webSocketServer({
		port: 8081
	}),
	wsGroup = {};//ws连接池


//建立webSocket服务器
wss.on('connection', function(ws) {
	console.log("connected!");
	ws.on('message', function(message) {
		console.log(message);
		wsGroup[msg.cid] = ws;
	});
});

exports.send = function(cid,data){
	console.log("sending!!!!");
	console.log(wsGroup);
	wsGroup[cid].send(data);
}
exports.wsGroup = wsGroup;

