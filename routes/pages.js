var ejs = require('ejs'),
	fs = require('fs'),
	read = fs.readFileSync,
	path = require('path'),
	moduleConfig = {},
	utils = require('../utils/utils.js'),
	managerPath = path.join(__dirname, '../views/manager/'),
	ws = require('../ws.js'),
	os = require('os');

var ifaces = os.networkInterfaces();
var ipAddress = '';

for (var dev in ifaces) {
	ifaces[dev].forEach(function(details) {
		if (details.family == 'IPv4' && !details.internal) {
			ipAddress = details.address;
		}
	});
}


exports.list = function(req, res) {
	var projectName = req.params.projectName;
	var managerPageListPath = managerPath + 'manager_page_home.ejs';
	var realPath = path.join(__dirname, '../../Projects/' + projectName + '/pages/');
	var fileNames = utils.getDirFileNames(realPath, true, '.ejs'); //获得所有page

	var renderData = {
		project: projectName,
		pages: fileNames
	}
	process.nextTick(function() {
		res.render(managerPageListPath, renderData);
	})
};

exports.feedBack = function(req, res) {
	var data = req.body;
	var feedBack = data.feedBack ? data.feedBack : 'null';
	var date = new Date(),
		dateId = date.getTime(),
		time = date.getFullYear() + '/' + date.getMonth() + '/' + date.getDay() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	var insertData = dateId + ',' + time + ',' + data.projectName + ',' + data.pageName + ',' + data.clientInfo + ',' + data.isOK + ',' + feedBack + ';\n'

	var infoPath = path.join(__dirname, '../../Projects/' + data.projectName + '/info');
	fs.exists(infoPath, function(exists) {
		if (!exists) {
			//如果没有这个文件 那么创建一个
			fs.open(infoPath, "w", 0644, function(e, fd) {
				if (e) throw e;
				fs.write(fd, insertData, 0, 'utf8', function(e) {
					if (e) throw e;
					fs.closeSync(fd);
					res.send("123");
				})
			});
		} else {
			//如果有的话 那么写入文件
			fs.open(infoPath, "a+", 0644, function(e, fd) {
				if (e) throw e;
				fs.readFile(infoPath, 'utf8', function(err, file) {
					if (err) console.log(err);
					else {
						insertData = insertData + file.toString();
						fs.write(fd, insertData, 0, 'utf8', function(e) {
							if (e) console.log(e);
							fs.closeSync(fd);
							res.send("123");
						})
					}
				})
			});
		}
	});

}


//由于Projects是express的默认views文件夹 因此无需对res设置header
exports.page = function(req, res) {
	var pageName = req.params.name,
		projectName = req.params.projectName;

	utils.checkFileExist(projectName, pageName, function(exists) {
		if (!exists) {
			res.send("404...");
		} else {
			var pageConfig = require('../../Projects/' + projectName + '/pages/' + pageName + '.config.json'),
				pageData = require('../../Projects/' + projectName + '/pages/' + pageName + '.data.json'),
				pageEjs,
				modules;
			var renderData = {
				moduleConfig: pageConfig,
				moduleData: pageData,
				projectName: projectName,
				pageName: pageName,
				moduleDataToString: JSON.stringify(pageData, '', 2),
				randonNum: utils.getRandomMd5()
			}
			var realPath = path.join(__dirname, '../../Projects/' + projectName + '/pages/' + pageName + '.ejs');
			fs.readFile(realPath, "utf-8", function(err, file) {
				if (err) {
					console.log(err);
				} else {
					modules = getModules(file);
					var modulePath = [];
					for (var i = 0; i < modules.length; i++) {
						//这里的modulePath 从 Projects根目录开始
						modulePath.push(projectName + '/components/' + modules[i] + '.ejs');
					}
					var htmls = getHtmls(modulePath, renderData);
					renderData.htmls = htmls;
					renderData.modules = modules;

					renderData.pageSource = file.toString();
					renderData.ipAddress = ipAddress;
					renderData.serverPort = 3000; // 这里暂时写死 不知道去哪里读取。

					var managerPagePath = path.join(__dirname, '../views/manager/manager_page.ejs');
					res.render(managerPagePath, renderData);
				}
			});
		}
	});
}

exports.pagePreview = function(req, res) {

	var clientId = req.query.clientId;
	//如果有clientId 那么连接webSocket

	if (clientId) {
		var userAgent = req.headers['user-agent'];
		ws.send(clientId, JSON.stringify({
			'status': 'ready',
			'user-agent': userAgent
		}));
	};
	var pageName = req.params.name,
		projectName = req.params.projectName,
		pageConfig = require('../../Projects/' + projectName + '/pages/' + pageName + '.config.json'),
		pageData = require('../../Projects/' + projectName + '/pages/' + pageName + '.data.json');
	var renderData = {
		moduleConfig: pageConfig,
		moduleData: pageData,
		pageName: pageName
	}
	res.render(projectName + '/pages/' + pageName + '.ejs', renderData);
}

/*
	通过name获取moduleConfig.json中的模块配置 return {}
*/
function getModuleConfig(moduleType, name) {
	var data = {};
	for (mt in moduleConfig) {
		if (mt == moduleType) {
			for (module in moduleConfig[mt]) {
				if (module == name) {
					data = moduleConfig[mt][module];
					break;
				};
			}
			break;
		};
	}
	return data;
}

function getHtmls(pathNames, renderData) {
	var htmls = [];
	for (var i = 0; i < pathNames.length; i++) {
		var pathName = path.join(__dirname, '../../Projects/' + pathNames[i]);
		var html = ejs.render(read(pathName, 'utf8'), renderData);
		htmls.push(html);
	}
	return htmls;
}

function resolveInclude(name, filename) {
	console.log("path is :" + name + "----" + filename);
	var path = path.join(path.dirname(filename), name);
	var ext = path.extname(name);
	if (!ext) path += '.ejs';
	return path;
}

//读取page文件 自动判断其中include了几个模块 return [模块数组]
function getModules(fs) {
	var modules = [];
	fs.toString().replace(/<%\s*include{1}\s+\S*\/{1}(\S+)\.ejs{1}\s*\S*%>/ig, function($1, $2) {
		modules.push($2);
	});
	return modules;
}