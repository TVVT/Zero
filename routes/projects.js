var fs = require('fs'),
    path = require('path'),
    os = require('os'),
    _ = require('underscore'),
    settings = require('../settings'),
    utils = require('../utils/utils'),
    managerPath = path.join(__dirname, '../views/manager/');

var link;
link = utils.getIP(function(ip) {
    link = ip;
});

var file_every = new Array();

exports.index = function(req, res) {
    var realPath = path.join(__dirname, '../../Projects/');
    var dir = fs.readdirSync(realPath);
    dir = _.without(dir,
        ".bowerrc",
        ".DS_Store",
        "node_modules",
        "npm-debug.log",
        ".git",
        ".gitignore", "package.json",
        "public",
        "config.json",
        "sublime_projects",
        "gulpfile.js");

    //  时间排序。
    dir.sort(function(a, b) {
        return fs.statSync(realPath + b).mtime.getTime() -
            fs.statSync(realPath + a).mtime.getTime();
    });

    var renderData = {
            projects: dir,
            link: link
        }
        //得到项目及项目页路径    
    for (var i = 0; i < dir.length; i++) {
        file_every.push({
            "title": dir[i],
            "link": link + '/' + dir[i] + '/pages?page_home'
        });
        for (var j = 0; j < utils.getDirFileNames(realPath + dir[i] + '/pages/', true, '.ejs').length; j++) {
            file_every.push({
                "title": utils.getDirFileNames(realPath + dir[i] + '/pages/', true, '.ejs')[j],
                "link": 'http://192.168.1.101:3000/' + dir[i] + '/pages/' + utils.getDirFileNames(realPath + dir[i] + '/pages/', true, '.ejs')[j]
            });
        }
    }
    //判断文件是否存在
    fs.exists('project_manager.json', function(exists) {
        console.log(exists);
        //util.debug(exists ? "it's there" : "no passwd!");
        if (exists) {
            //读取json文件
            fs.readFile('project_manager.json', function(err, data) {
                if (err) throw err;
                console.log(data);
            });
            //写入json文件
            fs.writeFile('project_manager.json', '{"file_every":' + JSON.stringify(file_every) + '}', function(err) {
                if (err) throw err;
                console.log('project_manager.json\'s data saved!');
            });
            /*fs.close('project_manager.json', function() {

            });*/
        }
    });

    res.render(managerPath + 'manager_projects_list.ejs', renderData);
}
