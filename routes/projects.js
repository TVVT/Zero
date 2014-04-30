var fs = require('fs'),
    path = require('path'),
    os = require('os'),
    _ = require('underscore'),
    settings = require('../settings'),
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

exports.index = function(req, res) {
    var realPath = path.join(__dirname, '../../Projects/');
    var dir = fs.readdirSync(realPath);
    dir = _.without(dir, 
    	".bowerrc",
        ".git",
        ".gitignore", "package.json",
        "public",
        "gulpfile.js");
    var renderData = {
    	projects:dir,
        link:link
    }

    res.render(managerPath+'manager_projects_list.ejs',renderData);
}
