
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.page = function(req,res){
	var pageName = req.params.name;
	var renderData = {
		pageName:pageName,
		modules:['../uis/header.ejs','../uis/list.ejs','../uis/footer.ejs'],
		moduleConfig:{
			header:{
				'textAlign':'center'
			},
			list:{
				'listData':[{'id':1,'name':'kevin14'},{'id':2,'name':'fengfeng'}],
				'textAlign':'left'
			},
			footer:{
				'textAlign':'center'
			}
		}
	}
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