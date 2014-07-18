// TODO 长连接的关闭和清理
var wsPort = require('./settings.json').wsPort;
var webSocketServer = require('ws').Server,
    wss = wss ? wss : new webSocketServer({
        port: wsPort
    }),
    wsGroup = {}; //ws连接池

//建立webSocket服务器
wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        var msg = JSON.parse(message);
        if (msg.isClient) {
            if (wsGroup[msg.cid]) {
                if (!wsGroup[msg.cid].group) {
                    wsGroup[msg.cid].group = [];
                    wsGroup[msg.cid].group.push(ws);
                } else {
                    wsGroup[msg.cid].group.push(ws);
                }
            };
        } else {
            wsGroup[msg.cid] = wsGroup[msg.cid] || {};
            wsGroup[msg.cid].server = ws;
        }
    });
});

wss.on('close', function(data) {
    console.log(data);
    console.log('disconnected');
});

//type 1代表是server 2代表客户端
exports.send = function(cid, type, data) {
    if (wsGroup[cid]) {
        if (type == 1) {
            wsGroup[cid] = wsGroup[cid] || {};
            try{
                wsGroup[cid].server.send(data);
            }catch(e){
                console.log(e);
            }
        } else {
            if (wsGroup[cid].group) {
                wsGroup[cid].group.forEach(function(ws, index) {
                    try {
                        ws.send(data);
                    } catch (e) {
                        delete wsGroup[cid].group[index];
                        console.error(e);
                    }
                })
            };
        }

    } else {
        console.log("没有" + cid + "的这个ws实例");
    }
}
exports.wsGroup = wsGroup;
