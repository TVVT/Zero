var express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');
var uis = require('./routes/uis');
var pages = require('./routes/pages');
var tool = require('./routes/tool');
var projects = require('./routes/projects');
var service = require('./routes/service');
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
app.use(express.favicon(path.join(__dirname, 'public/manager/images/favicon.ico')));
// app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(cookieParser())
app.use(session({ secret: 'tvvt', key: 'sid', cookie: { secure: true ,maxAge:604800000}}))


app.use(express.static( path.join(__dirname, './public') ,{
    setHeaders: function (res, path, stat) {
        console.log(res,path);
        res.set('Access-Control-Allow-Origin', '*');
    }
}));


//将public配置提前
app.use(app.router);

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//项目首页
app.get('/', projects.index);

//用户提交的反馈信息
app.post('/feedBack', pages.feedBack);
app.post('/changeCurPage', pages.changeCurPage);
app.post('/checkWs', pages.checkWs);

app.get('/:projectName/pages/preview/:name', pages.pagePreview);
app.get('/:projectName/pages', pages.list);
app.get('/:projectName/pages/:name', pages.page);

//模块列表
app.get('/ui/getList',uis.getList);
app.get('/ui/:projectName',uis.list);
app.get('/ui/:projectName/:ui',uis.ui);

//下载页面
app.get('/:projectName/pages/download/:name', pages.downloadPackage);

app.get('/qr', service.qr);
app.get('/tags',service.tags);
app.get('/imagebed',tool.imagebed);
app.post('/imagebed/uploadImage',tool.getImages);


// 请求并打印
app.get('/request',tool.request);


//读取public下面的静态文件
app.get('/projects/*', _static.getFile);

// 404 TODO
app.get('*', function(req, res) {
    res.status(404).send("404...")
});


http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
    console.log('you can view your project at http://localhost:' + app.get('port') + '/:project/pages/:name');
    console.log('you can preview your project at http://localhost:' + app.get('port') + '/:project/pages/preview/:name');
});
