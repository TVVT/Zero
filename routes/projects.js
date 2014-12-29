var fs = require('fs'),
    path = require('path'),
    os = require('os'),
    _ = require('underscore'),
    settings = require('../settings'),
    utils = require('../utils/utils'),
    managerPath = path.join(__dirname, '../views/manager/');

var projectsFolder = settings.projectsFolder || '../Projects';
projectsFolder = '../' + projectsFolder + '/';
var link;
link = utils.getIP(function(ip) {
    link = ip;
});

exports.index = function(req, res) {
    var realPath = path.join(__dirname, projectsFolder);

    try{
        var dir = fs.readdirSync(realPath);
    }catch(e){
        console.log(e)

        var data = {
            errorInfo:e
        }

        res.render(path.join(__dirname, '../views/error.ejs'),data);

        return
    }

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
    // console.log(dir);

    // dir.sort(function(a, b) {
    //     return a - b;
    //     // return fs.statSync(realPath + b).mtime.getTime() -
    //     //     fs.statSync(realPath + a).mtime.getTime();
    // });

    // console.log(dir)



    var renderData = {
        projects: dir,
        link: link
    }

    res.render(managerPath + 'manager_projects_list.ejs', renderData);
}
