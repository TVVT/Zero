var fs = require('fs'),
    path = require('path'),
    os = require('os'),
    jade = require('jade'),
    formidable = require('formidable'),
    utils = require('../utils/utils'),
    settings = require('../settings.json');

var request = require("request");
var tcpie = require("tcpie");

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


        if (files.file && files.file.name != "" && files.file.size > 0) {
            var name,targetPath,url;

            console.log(fields.path);

            if(fields.path){
                targetPath = path.join(__dirname,'../public/imageBed/'+ fields.path);
                url = '/imageBed/'+fields.path;

                console.log(targetPath);

            }else{
                name = getRandromTime(files.file.name);
                targetPath = path.join(__dirname,'../public/imageBed/'+ name);
                url = '/imageBed/'+name;
            }


            fs.renameSync(files.file.path, targetPath);// function(err) {
                // if (err) throw err;
            res.send({
                'res_code':'1',
                'file':targetPath,
                'url' : url
            }+'');
            //});


        } else {
            res.send({
                'res_code':'0',
                'res_msg':'空文件or错误!'
            }+'');
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

    res.send(ip+'');
}

exports.getPIIP = function(req,res){
    res.send(PIip+'');
}


exports.getImg = function (req, res) {
    if (typeof req.cookies.isImgUse == 'undefined') {
        res.cookie('isImgUse', 0, {maxAge: 600000});
    }


    var ip = '192.168.112.94';
    var url = req.url.replace('/img/', '/');
    var p = 'http://' + ip + ':9000' + url;
    req.headers['Host'] = req.headers.host;

    if (req.cookies.isImgUse == 1) {
        request({
            method: req.method,
            url: p,
            headers: req.headers,
            timeout:3000
        }).on('error', function (err) {
            res.status('404');
            res.send('');
        }).pipe(res);
    } else {
        var pie = tcpie(ip, 9000, {count: 2, interval: 10, timeout: 500});
        pie.on('connect', function () {
            res.cookie('isImgUse', 1, {maxAge: 600000});
            request({
                method: req.method,
                url: p,
                headers: req.headers,
                timeout:3000
            }).on('error', function (err) {
                res.status('404');
                res.send('');
            }).pipe(res);
        }).on('error', function () {
            res.status('404');
            res.send('');
        }).on('timeout',function(){
            res.status('404');
            res.send('');
        }).start();
    }

};




function getRandromTime(filename){
    var extName = path.extname(filename);
    return ~~(new Date().getTime()/1000)+''+~~(Math.random()*100)+extName;
}


function getClientAddress (req) {
        return (req.headers['x-forwarded-for'] || '').split(',')[0]
        || req.connection.remoteAddress;
};



