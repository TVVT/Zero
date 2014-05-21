var ejs = require('ejs'),
    path = require('path'),
    ep = require('eventproxy'),
    fs = require('fs');
var regx = /([\{]{2}\s*include\({1}\s*(\w+)\,?\s*([^\}\s]*|[\-\{]{1}.*[\}\-]{1})\){1}\s*[\}]{2})/ig;
//tvvt的rander 返回html string
module.exports = function(project, html) {
    return render(project, html)
}

function render(project, html) {
    function regxReplace(project, html) {
        var renderData = {},
            data;
        return html.replace(regx, function($1, $2, $3, $4) {
            if ($4.length>0) {
                //加载指定的数据
                if(/\-\{.*\}\-/.test($4)){
                    $4.replace(/^\-(.*)\-$/,function($1,$2){
                        data = JSON.parse($2);
                    })
                }else{
                    dataPath = path.join(__dirname, '../../tata/' + project + '/' + $4 + '.json');
                    data = require(dataPath);
                }
                
            }else{
                //如果没有第二个参数 默认加载默认数据
                dataPath = path.join(__dirname, '../../Projects/' + project + '/components/' + $3 + '.json');
                data = require(dataPath);
            }
            realPath = path.join(__dirname, '../../Projects/' + project + '/components/' + $3 + '.ejs');
            var file = fs.readFileSync(realPath, "utf-8");
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
