var ejs = require('ejs'),
    fs = require('fs'),
    path = require('path'),
    utils = require('../utils/utils.js'),
    os = require('os'),
    settings = require('../settings.json'),
    managerPath = path.join(__dirname, '../views/manager/');

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

exports.getList = function(req, res) {
    var projectName = req.query.projectName,
        uiList = utils.getProjectUis(projectName);
    res.send(uiList);
}
