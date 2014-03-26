var ejs = require('ejs'),
	fs = require('fs'),
	read = fs.readFileSync,
	path = require('path'),
	dirname = path.dirname,
	extname = path.extname,
	join = path.join,
	moduleConfig ={};
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.page = function(req,res){
	var pageName = req.params.name;
	var projectName = req.params.projectName;
	moduleConfig = require('../../Projects/'+projectName+'/config.json');
	var pageConfig = getModuleConfig("pages",pageName);
	pageConfig.projectName = projectName;
	var renderData = {
		moduleConfig:pageConfig
	}

	var modulePath = [];
	for(var i=0;i<pageConfig.modules.length;i++){
		modulePath.push('views/'+moduleConfig.projectName+'/uis/'+pageConfig.modules[i]+'.ejs');
	}
	var htmls = getHtmls(modulePath,renderData);
	renderData.htmls = htmls;
	console.log(renderData);
	res.send('...');
	// res.render('manager/manager_page.ejs',renderData);
}

exports.pagePreview = function(req,res){
	console.log('pagePreview');
	var pageName = req.params.name;
	var projectName = req.params.projectName;
	moduleConfig = require('../../Projects/'+projectName+'/config.json');
	var pageConfig = getModuleConfig("pages",pageName);
	pageConfig.projectName = projectName;
	var renderData = {
		moduleConfig:pageConfig
	}
	res.render(moduleConfig.projectName+'/pages/'+pageName+'.ejs',renderData);
}

/*
	通过name获取moduleConfig.json中的模块配置 return {}
*/
function getModuleConfig(moduleType,name){
	var data = {};
	for(mt in moduleConfig){
		if (mt == moduleType) {
			for(module in moduleConfig[mt]){
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

function getHtmls(pathNames,renderData){
	var htmls = [];
	for(var i = 0;i<pathNames.length;i++){
		var pathName = resolveInclude('../../../'+pathNames[i],fs.realpathSync(pathNames[i]));
		var html = ejs.render(read(pathName, 'utf8'),renderData);
		htmls.push(html);
	}
	return htmls;
}

function resolveInclude(name, filename) {
  var path = join(dirname(filename), name);
  var ext = extname(name);
  if (!ext) path += '.ejs';
  return path;
}