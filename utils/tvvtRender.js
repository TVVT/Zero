var ejs = require('ejs'),
    path = require('path'),
    ep = require('eventproxy'),
    fs = require('fs');

//tvvt的rander 返回html string TODO 解决data的来源问题
module.exports = function(project, html) {
    var renderData = {};
    return html.replace(/(\{\{\s*include\({1}\s*(\w+)\,?\s*([^\}\s]*)\){1}\}\})/ig, function($1, $2, $3, $4) {
        realPath = path.join(__dirname, '../../Projects/' + project + '/components/' + $3 + '.ejs');
        dataPath = path.join(__dirname,'../../tata/'+project+'/'+$4+'.json');
        var file = fs.readFileSync(realPath, "utf-8");
        var data = require(dataPath);
        renderData.filename = realPath;
        renderData.data = data;
        return ejs.render(file, renderData);
    });
}
