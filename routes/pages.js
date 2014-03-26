var ejs = require('ejs'),
	fs = require('fs'),
	read = fs.readFileSync,
	path = require('path'),
	dirname = path.dirname,
	extname = path.extname,
	join = path.join;
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.page = function(req,res){
	var pageName = req.params.name;

	//renderData中的这些4个配置不能少 pageName,modules,moduleConfig,htmls,modulesName[i]
	var renderData = {
		pageName:pageName,
		modules:['m.yhd.com.views/uis/header.ejs','m.yhd.com.views/uis/list.ejs','m.yhd.com.views/uis/footer.ejs'],
		modulesName:['header','list','footer'],
		moduleConfig:{
			header:{
				uiInfo:'文字居中的header',
				textAlign:'center'
			},
			list:{
				listData:[{'id':1,'name':'kevin14'}],
				textAlign:'left',
				uiInfo:'文字居左的list',
			},
			footer:{
				'textAlign':'center',
				uiInfo:'文字居中的footer',
			}
		}
	}
	var htmls = getHtmls(renderData.modules,renderData)
	renderData.htmls = htmls;
	res.render('manager/manager_page.ejs',renderData);
}

exports.pagePreview = function(req,res){
	var pageName = req.params.name;
	var renderData = {
		pageName:pageName,
		moduleConfig:{
			header:{
				'textAlign':'center'
			},
			list:{
				listData:[{id:1,name:'kevin14'},{id:2,name:'fengfeng'},{id:2,name:'fengfeng'},{id:2,name:'fengfeng'},{id:2,name:'fengfeng'},{id:2,name:'fengfeng'}],
				'textAlign':'left'
			},
			footer:{
				'textAlign':'center'
			}
		}
	}
	res.render('pages/'+pageName+'.ejs',renderData);
}

function getHtmls(pathNames,renderData){
	var htmls = [];
	for(var i = 0;i<pathNames.length;i++){
		var pathName = resolveInclude('../../'+pathNames[i],fs.realpathSync(pathNames[i]));
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