var ejs = require('ejs'),
    path = require('path'),
    ep = require('eventproxy'),
    os = require('os'),
    fs = require('fs'),
    utils = require('../utils/utils'),
    settings = require('../settings.json');
var regx = /([\{]{2}\s*include\({1}\s*([\w\/]+)\,?\s*([^\}\s]*|[\-\{]{1}.*[\}\-]{1})\){1}\s*[\}]{2})/ig,
    regxHasData = /.*\<\%.*\%\>.*/,
    mRegx = /(\w*)\/(\w*)/;
var link;
link = utils.getIP(function(ip) {
    link = ip;
});
//tvvt的rander 返回html string
module.exports = function(project, html, pageData) {
    return render(project, html, pageData)
}

function render(project, html, pageData) {
    function regxReplace(project, html) {
        var renderData = {
                baseUrl: link + '/projects/' + project,
                publicUrl: link + '/projects/public',
                managerUrl: link + '/' + project,
                link: link
            },
            data = {};
        var passData = arguments[2];

        return html.replace(regx, function($1, $2, $3, $4) {

            //判断是否是本项目模块
            if ($3.indexOf('/') > -1) {
                //走public下的ejs
                var rResult = $3.match(mRegx);
                var mProject = rResult[1];
                var mModule = rResult[2];
                dataPath = path.join(__dirname, '../../Projects/' + mProject + '/components/' + mModule + '.json');
                realPath = path.join(__dirname, '../../Projects/' + mProject + '/components/' + mModule + '.ejs');
            } else {
                dataPath = path.join(__dirname, '../../Projects/' + project + '/components/' + $3 + '.json');
                realPath = path.join(__dirname, '../../Projects/' + project + '/components/' + $3 + '.ejs');
            }

            //获取数据
            if ($4.length > 0) {
                if (/\-\{.*\}\-/.test($4)) {
                    $4.replace(/^\-(.*)\-$/, function($1, $2) {
                        data = JSON.parse($2);
                    })
                }else{
                    data = pageData[$4];
                }
                
            }else{
                data = requireUncache(dataPath);
            }

            var file = fs.readFileSync(realPath, "utf-8");
            if (passData != undefined) {
                for (var o in passData) {
                    data[o] = passData[o];
                }
            }
            renderData.filename = realPath;
            renderData.data = data;
            if (regx.test(file)) {
                if (regxHasData.test(file)) {
                    file = regxReplace(project, file, data);
                } else {
                    file = regxReplace(project, file);
                }
            }
            return ejs.render(file, renderData);
        });
    }
    return regxReplace(project, html);
}


function requireUncache(module) {
    delete require.cache[require.resolve(module)]
    return require(module)
}
