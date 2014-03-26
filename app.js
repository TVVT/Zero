
/**
 * Module dependencies.
 */

var express = require('express');
var uis = require('./routes/uis');
var pages = require('./routes/pages')
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/uis',uis.list);
app.get('/uis/:name',uis.ui);
app.get('/uis/download/:projectName/:name',uis.uiDownload);
app.get('/uis/:name/:id',uis.uiById);

app.get('/pages',pages.list);
app.get('/pages/:projectName/:name',pages.page);
app.get('/pages/preview/:projectName/:name',pages.pagePreview);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
