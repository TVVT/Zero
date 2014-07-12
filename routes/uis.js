var ejs = require('ejs'),
    fs = require('fs'),
    path = require('path'),
    utils = require('../utils/utils.js'),
    os = require('os'),
    settings = require('../settings.json'),
    utils = require('../utils/utils'),
    managerPath = path.join(__dirname, '../views/manager/');
var link;
link = utils.getIP(function(ip) {
    link = ip;
});

exports.list = function(req, res) {
    //进行浏览器检测   
    if (req.headers['user-agent'].indexOf("Chrome") == -1 || req.headers['user-agent'].match(/Chrome\/(\d+)\./)[1] < 30) {
        res.render(path.join(__dirname, '../views/wrong_browser.ejs'));
    } else {
        var projectName = req.params.projectName;
        var renderData = {
        	project:projectName,
        	uiList:utils.getProjectUis(projectName),
        	link:link
        }
        var managerPagePath = path.join(__dirname, '../views/manager/manager_ui_list.ejs');
        res.render(managerPagePath,renderData);

    }
}

exports.ui = function(req,res){
    var projectName = req.params.project;
    var uiName = req.params.ui;

    var renderData = {
        project:projectName,
        uiName:uiName,
        link:link
    }
    var managerPagePath = path.join(__dirname, '../views/manager/manager_ui.ejs');
    res.render(managerPagePath,renderData);
}

exports.getList = function(req, res) {
    var projectName = req.query.projectName,
        uiList = utils.getProjectUis(projectName);
    res.send(uiList);
}
