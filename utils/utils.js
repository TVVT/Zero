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

exports.readFile = function(filePath,charset,callback){
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