exports.list = function(req, res){
	res.send('成功！');
  // res.render('index', { title: 'Express' });
};

exports.ui = function(req,res){
	var uiName = req.params.name;
	var renderData = {
		'uiName':uiName
	}
	res.render('manager/manager_ui.ejs',renderData);
}

exports.uiById = function(req,res){
	var uiName = req.params.name;
	var uiType = req.params.id;

	var renderData = {
		uiName:uiName,
		uiType:uiType,
		modulePath:'../uis/'+uiName+'.ejs'
	}
	res.render('manager/manager_ui_preview.ejs',renderData);

}

exports.list = function(req,res){

}