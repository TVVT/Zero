var fs = require('fs'),
	read = fs.readFileSync,
	path = require('path'),
	exec = require('child_process').exec,
	settings = require('../settings.json'),
	mime = require("../utils/utils.js").mimes_types;

var projectsFolder = settings.projectsFolder || '../Projects';
projectsFolder = '../' + projectsFolder + '/';
//获取public下静态文件的接口 TODO 文件缓存 避免每次都读文件
exports.getFile = function(req, res) {
	var fileName = req.params[0],
		realPath = path.join(__dirname,projectsFolder + fileName);
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

//下载icon-fonts
exports.iconDownload = function(req,res){
	var projectName = req.params.projectName,
        cmd;

    //压缩 并删除原文件 之后再创建temp文件夹
    cmd = "zip -r ./downloads/" + projectName + ".zip ../iconfonts/"+projectName+"/fonts";
    try {
        exec(cmd, function(err, stdout, stderr) {
            if (err) {
                console.error(err)
                res.end("error")
            } else {
                var downloadLink = path.join(__dirname, "../downloads/" + projectName + ".zip")
                res.download(downloadLink, projectName + '.zip', function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        exec("rm ./downloads/" + projectName + ".zip", function() {})
                    }
                });
            }

        });
    } catch (e) {
        console.error(e);
    }
}

//iconfonts服务
exports.getIconFonts = function(req, res) {

	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

	var fileName = req.params[0],
		realPath = path.join(__dirname,'../../iconfonts/' + fileName);
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