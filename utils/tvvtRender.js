var ejs = require('ejs'),
    path = require('path'),
    ep = require('eventproxy'),
    fs = require('fs');
var regx = /(\{\{\s*include\({1}\s*(\w+)\,?\s*([^\}\s]*)\){1}\}\})/ig;
//tvvt的rander 返回html string TODO 没有data的情况 由于情况特殊 讨论后再定夺
module.exports = function(project, html) {
    return render(project, html)
}

function render(project, html) {
    function regxReplace(project, html) {
        var renderData = {};
        return html.replace(regx, function($1, $2, $3, $4) {
            realPath = path.join(__dirname, '../../Projects/' + project + '/components/' + $3 + '.ejs');
            dataPath = path.join(__dirname, '../../tata/' + project + '/' + $4 + '.json');
            var file = fs.readFileSync(realPath, "utf-8");
            var data = require(dataPath);
            renderData.filename = realPath;
            renderData.data = data;
            if (regx.test(file)) {
                file = regxReplace(project, file);
            }
            return ejs.render(file, renderData);
        });
    }
    return regxReplace(project, html);
}
