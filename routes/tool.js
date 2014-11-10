var fs = require('fs'),
    path = require('path'),
    os = require('os'),
    jade = require('jade'),
    formidable = require('formidable'),
    utils = require('../utils/utils'),
    settings = require('../settings.json');

var link;
link = utils.getIP(function(ip) {
    link = ip;
});
var PIip = "127.0.0.1";

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

exports.request = function(req,res){
    var ip = getClientAddress(req);

    // fs.appendFile( __dirname + '/request.log', ip + '\n' , function (err) {
    //   if (err) throw err;
    //   console.log('The "data to append" was appended to file!');
    // });
    
    PIip = ip;   

    res.send(ip);
}

exports.getPIIP = function(req,res){
    res.send(PIip);
}


function getRandromTime(filename){
    var extName = path.extname(filename);
    return ~~(new Date().getTime()/1000)+''+~~(Math.random()*100)+extName;
}


function getClientAddress (req) {
        return (req.headers['x-forwarded-for'] || '').split(',')[0] 
        || req.connection.remoteAddress;
};



