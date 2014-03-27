var ejs = require('ejs'),
	fs = require('fs'),
	read = fs.readFileSync,
	path = require('path'),
	dirname = path.dirname,
	extname = path.extname,
	join = path.join,
	moduleConfig = {};

exports.list = function(req, res) {
	res.send("respond with a resource");
};

//由于Projects是express的默认views文件夹 因此无需对res设置header
exports.page = function(req, res) {
	var pageName = req.params.name,
		projectName = req.params.projectName,
		pageConfig = require('../../Projects/' + projectName + '/pages/' + pageName + '.config.json'),
		pageData = require('../../Projects/' + projectName + '/pages/' + pageName + '.data.json'),
		modules;

	var renderData = {
		moduleConfig: pageConfig,
		moduleData: pageData,
		projectName: projectName,
		pageName:pageName
	}

	var realPath = path.join(__dirname, '../../Projects/' + projectName + '/pages/' + pageName + '.ejs');
	fs.exists(realPath, function(exists) {
		if (!exists) {
			res.send("This request URL " + fileName + " was not found on this server.");
		} else {
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
					var managerPagePath = path.join(__dirname, '../views/manager/manager_page.ejs');
					res.render(managerPagePath, renderData);
				}
			});
		}
	});
}

exports.pagePreview = function(req, res) {
	var pageName = req.params.name,
		projectName = req.params.projectName,
		pageConfig = require('../../Projects/' + projectName + '/pages/' + pageName + '.config.json'),
		pageData = require('../../Projects/' + projectName + '/pages/' + pageName + '.data.json');
	var renderData = {
		moduleConfig: pageConfig,
		moduleData: pageData,
		pageName:pageName
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
		var pathName = path.join(__dirname, '../../Projects/'+pathNames[i]);
		var html = ejs.render(read(pathName, 'utf8'), renderData);
		htmls.push(html);
	}
	return htmls;
}

function resolveInclude(name, filename) {
	console.log("path is :"+name+"----"+filename);
	var path = join(dirname(filename), name);
	var ext = extname(name);
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