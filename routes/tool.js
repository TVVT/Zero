var fs = require('fs'),
    path = require('path'),
    os = require('os'),
    jade = require('jade'),
    formidable = require('formidable'),
    settings = require('../settings.json');

var ifaces = os.networkInterfaces();
var ipAddress = 'localhost';

for (var dev in ifaces) {
    ifaces[dev].forEach(function(details) {
        if (details.family == 'IPv4' && !details.internal) {
            ipAddress = details.address;
        }
    });
}
var link = 'http://' + ipAddress + ':' + settings.port;

exports.imagebed = function(req, res) {
    var renderData = {
        title: "上传图片"
    }
    var html = jade.renderFile(path.join(__dirname, '../views/tools/image-bed-upload.jade'), renderData);
    res.send(html);
}

exports.getImages = function(req, res) {
    form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) return res.end('formidable failed...')
        res.set('Access-Control-Allow-Origin', '*');
        // res.send(files);
        if (files.file && files.file.name != "" && files.file.size > 0) {
            var name = getRandromTime(files.file.name);
            var targetPath = path.join(__dirname,'../public/imageBed/'+ name);
            var url = '/imageBed/'+name;
            
            fs.rename(files.file.path, targetPath, function(err) {
                if (err) throw err;
                res.send({
                    'res_code':'1',
                    'file':targetPath,
                    'url' : url
                });
            });
        } else {
            res.send({
                'res_code':'0',
                'res_msg':'空文件or错误!'
            });
        }
    });
}

function getRandromTime(filename){
    var extName = path.extname(filename);
    return ~~(new Date().getTime()/1000)+''+~~(Math.random()*100)+extName;
}
