var ejs = require('ejs'),
	fs = require('fs'),
	read = fs.readFileSync,
	path = require('path'),
	dirname = path.dirname,
	extname = path.extname,
	join = path.join,
	moduleConfig ={};

exports.list = function(req, res) {
	res.send('成功！');
	// res.render('index', { title: 'Express' });
};

exports.ui = function(req, res) {
	var uiName = req.params.name;
	var renderData = {
		'uiName': uiName
	}
	res.render('manager/manager_ui.ejs', renderData);
}

exports.uiById = function(req, res) {
	var uiName = req.params.name;
	var uiType = req.params.id;

	var renderData = {
		uiName: uiName,
		uiType: uiType,
		modulePath: '../uis/' + uiName + '.ejs'
	}
	res.render('manager/manager_ui_preview.ejs', renderData);

}

exports.list = function(req, res) {

}

exports.uiDownload = function(req, res) {
	var uiName = req.params.name;
	var projectName = req.params.projectName;
	var downloadLink = path.join(__dirname, '../../Projects/'+projectName+'/components/'+uiName+'.ejs')
	res.download(downloadLink, uiName+'.ejs', function(err) {
		if (err) {
			console.log(err);
		} else {

		}
	});
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