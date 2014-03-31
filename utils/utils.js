var fs = require('fs'),
    crypto = require('crypto'),
    path = require('path');

exports.mimes_types = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};

exports.readFile = function(filePath, charset, callback) {
    path.exists(filePath, function(exists) {
        if (!exists) {
            return callback("文件不存在！");
        } else {
            //找到文件在这里进行处理
            fs.readFile(filePath, charset, function(err, file) {
                if (err) {
                    return callback(err);
                } else {
                    return callback(file.toString());
                }
            });
        }
    });
}

/*
 *   读取目录下所有文件的文件名  返回数组
 *   param1 路径名 绝对路径
 *   param2 是否只输出文件名 不带后缀名
 *   param3 得到后缀名为的extName的数组
 *
 */
exports.getDirFileNames = function(filePath, isModule, extName) {
    var files = fs.readdirSync(filePath);
    var fileNames = [];
    for (var i = 0; i < files.length; i++) {
        if (isModule) {
            if (extName) {
                if (path.extname(files[i]) === extName) {
                    fileNames.push(path.basename(files[i], extName));
                }
            } else {
                fileNames.push(path.basename(files[i], path.extname(files[i])));
            }
        } else {
            if (extName) {
                if (path.extname(files[i]) === extName) {
                    fileNames.push(path.basename(files[i]));
                }
            } else {
                fileNames.push(path.basename(files[i]));
            }
        }
    }
    return fileNames;
}

/**
 * 获取随机md5字符串 日期＋随机数字 md5
 */
exports.getRandomMd5 = function(){
    var md5 = crypto.createHash('md5'),
        date = new Date();
    return md5.update((date.getTime()+Math.ceil(Math.random()*1000)).toString()).digest('hex');
}