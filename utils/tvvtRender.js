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

var regxFix = /\{\{\s*include\((\s*((\s*\-\{.*\}\-\s*\,?)|([\w\/]*\s*\,?\s*)){0,}\s*)\)\s*\}\}/ig,
    selfDataFix = /\-\{.*\}\-/g;

var link;
link = utils.getIP(function(ip) {
    link = ip;
});
//tvvt的rander 返回html string
module.exports = function(project, html, pageData) {
    return render(project, html, pageData)
}

function render(project, html,pageData) {

    function regxReplace(project, html) {
        var renderData = {
                baseUrl: link + '/projects/' + project,
                publicUrl: link + '/projects/public',
                managerUrl: link + '/' + project,
                link: link
            },
            data = {};
        var passData = arguments[2];

        return html.replace(regxFix, function($1, $2) {

            var pars = $2;
            var selfData;

            pars.replace(selfDataFix,function(d){
                selfData = d;
            });

            if(selfData){
                pars = pars.replace(selfDataFix,'');
            }

            var options = pars.split(',');

            options.map(function(option){
                return option.trim();
            });



            var append = options[2] == 'true' ? true : false;

            var defaultDataPath;

            if (options[0].indexOf('/') > -1) {
                //走public下的ejs
                var rResult = options[0].match(mRegx);
                var mProject = rResult[1];
                var mModule = rResult[2];
                defaultDataPath = path.join(__dirname, '../../Projects/' + mProject + '/components/' + mModule + '/'+mModule+'.json');
                realPath = path.join(__dirname, '../../Projects/' + mProject + '/components/' + mModule + '/'+mModule+'.ejs');
            } else {
                defaultDataPath = path.join(__dirname, '../../Projects/' + project + '/components/' + options[0] + '.json');
                realPath = path.join(__dirname, '../../Projects/' + project + '/components/' + options[0] + '.ejs');
            }

            var defaultData = requireUncache(defaultDataPath);

            if(selfData){
                selfData.replace(/^\-(.*)\-$/,function($1,$2){
                    data = JSON.parse($2);
                })
                if(options[2]){
                    data = mergeData(defaultData,data);
                }
            }else if(options[1]){
                var dataPath = path.join(__dirname, '../../tata/' + project + '/' + options[0] + '.json');
                if(fs.existsSync(dataPath)){
                    data = requireUncache(dataPath);
                }else{
                    data = pageData[options[1]];
                }
                if(options[2]){
                    data = mergeData(defaultData,data);
                }
            }else{
                data = defaultData;
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


function mergeData(d1,d2){
    for(var i in d1){
        if(d2[i]){
            d1[i] = d2[i]; 
        }
    }
    return d1;
}

function requireUncache(module) {
    delete require.cache[require.resolve(module)]
    return require(module)
}
