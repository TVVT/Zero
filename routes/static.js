var fs = require('fs'),
	read = fs.readFileSync,
	path = require('path'),
	mime = require("../utils/utils.js").mimes_types;;

//获取public下静态文件的接口 TODO 文件缓存 避免每次都读文件
exports.getFile = function(req, res) {
	var fileName = req.params[0],
		realPath = path.join(__dirname,'../../Projects/' + fileName);
	fs.exists(realPath, function(exists) {
		if (!exists) {
			res.send("This request URL " + fileName + " was not found on this server.");
		} else {
			//找到文件在这里进行处理
			fs.readFile(realPath,function(err, file) {
				if (err) {
					res.end(err);
				} else {
					var ext = path.extname(realPath);
					ext = ext ? ext.slice(1) : 'unknown';
					var contentType = mime[ext] || "text/plain";
					res.charset = 'utf-8';
					res.set('Content-Type', mime[ext] || 'text/plain');
					res.end(file);
				}
			});
		}
	});
}