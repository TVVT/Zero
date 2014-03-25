exports.list = function(req, res){
	res.send('成功！');
  // res.render('index', { title: 'Express' });
};

exports.ui = function(req,res){
	res.send(req.params.name);
}