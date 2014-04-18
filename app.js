var express = require('express');
var uis = require('./routes/uis');
var pages = require('./routes/pages')
var http = require('http');
var path = require('path');
var _static = require('./routes/static');
var util = require('./utils/utils'),
	port = require('./settings').port;

var app = express();


// all environments
app.set('port', process.env.PORT || port);
app.set('views', path.join(__dirname, '../Projects'));

app.set('view engine', 'ejs');
// app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

//将public配置提前
app.use(express.static(path.join(__dirname, './public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

//用户提交的反馈信息
app.post('/feedBack',pages.feedBack);

app.get('/components', uis.list);
app.get('/:projectName/components/:componentName', uis.showComponent);
app.get('/:projectName/components/download/:name', uis.uiDownload);
app.get('/components/:name/:id', uis.uiById);

app.get('/:projectName/pages', pages.list);
app.get('/:projectName/pages/:name', pages.page);
app.get('/:projectName/pages/preview/:name', pages.pagePreview);
//下载页面
app.get('/:projectName/pages/download/:name',pages.downloadPackage);

//读取public下面的静态文件
app.get('/projects/*', _static.getFile);

// 404 TODO
app.get('*', function(req, res){
	res.send("404...")
});


http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
	console.log('you can view your project at http://localhost:' + app.get('port') + '/:project/pages/:name');
	console.log('you can preview your project at http://localhost:' + app.get('port') + '/:project/pages/preview/:name');
});