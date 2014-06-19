var fs = require('fs'),
    path = require('path');
// server.js
var qr = require('qr-image');


exports.qr = function(req, res) {
    var url = req.query.url;
    if (url) {
        var code = qr.image(url, {
            type: 'png',
            size: 4
        });
        res.type('png');
        code.pipe(res);
    } else {
        res.end(null);
    }
}

exports.tags = function(req, res) {
    var projectName = req.query.projectName;
    var configPath = path.join(__dirname, '../../Projects/config.json');
    fs.readFile(configPath,function(err,data){
    	res.send(JSON.parse(data)[projectName]);
    })
}
