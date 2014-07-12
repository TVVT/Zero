var ejs = require('ejs'),
    fs = require('fs'),
    read = fs.readFileSync,
    path = require('path'),
    moduleConfig = {},
    utils = require('../utils/utils.js'),
    managerPath = path.join(__dirname, '../views/manager/'),
    ws = require('../ws.js'),
    os = require('os'),
    formidable = require('formidable'),
    exec = require('child_process').exec,
    settings = require('../settings.json'),
    tvvtRender = require('../utils/tvvtRender'),
    request = require('request');

var link;
link = utils.getIP(function(ip) {
    link = ip;
});

exports.list = function(req, res) {
    var projectName = req.params.projectName;
    var managerPageListPath = managerPath + 'manager_page_home.ejs';
    var realPath = path.join(__dirname, '../../Projects/' + projectName + '/pages/');
    var fileNames = utils.getDirFileNames(realPath, true, '.ejs');

    // 时间排序
    fileNames.sort(function(a, b) {

        return fs.statSync(realPath + b + '.ejs').mtime.getTime() -
            fs.statSync(realPath + a + '.ejs').mtime.getTime();
    });

    var renderData = {
        project: projectName,
        pages: fileNames
    }
    process.nextTick(function() {
        res.render(managerPageListPath, renderData);
    })
};

exports.feedBack = function(req, res) {
    form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) return res.end('formidable failed...');
        var data = fields;
        var feedBack = data.feedback ? data.feedback : '';
        if (data.isOK) {
            var bugUrl = 'http://192.168.112.94:4000/zeroBugReceiver';
            var bugData = {
                bugdetail: feedBack,
                browserinfo: data.clientInfo,
                weburl: link + '/' + data.projectName + '/pages/' + data.pageName
            }
            request.post(bugUrl, {
                form: bugData
            }, function(err, response, body) {
                console.log(body);
            });
        };
        res.set('Access-Control-Allow-Origin', '*');
        res.send('ok');
    });
}


//由于Projects是express的默认views文件夹 因此无需对res设置header
exports.page = function(req, res) {

    //进行浏览器检测   
    if (req.headers['user-agent'].indexOf("Chrome") == -1 || req.headers['user-agent'].match(/Chrome\/(\d+)\./)[1] < 30) {
        res.render(path.join(__dirname, '../views/wrong_browser.ejs'));
    } else {
        var pageName = req.params.name,
            projectName = req.params.projectName,
            pageList = utils.getProjectPages(projectName);

        utils.checkFileExist(projectName, pageName, function(exists) {
            if (!exists) {
                res.send("404...");
            } else {

                try {
                    var pageConfig = require('../../Projects/' + projectName + '/pages/' + pageName + '.config.json'),
                        pageData = requireUncache('../../Projects/' + projectName + '/pages/' + pageName + '.data.json');
                } catch (e) {
                    console.log(e);
                    var pageConfig = {},
                        pageData = {};
                }

                var pageEjs,
                    modules;
                var renderData = {
                    baseUrl: link + '/projects/' + projectName,
                    publicUrl: link + '/projects/public',
                    managerUrl: link + '/' + projectName,
                    link: link,
                    moduleConfig: pageConfig,
                    projectName: projectName,
                    pageName: pageName,
                    moduleDataToString: JSON.stringify(pageData, '', 4),
                    randonNum: utils.getRandomMd5()
                }
                utils.extend(renderData, pageData);
                var nextPage = getNextPage(pageList, pageName),
                    prevPage = getPrevPage(pageList, pageName);
                renderData.nextPageUrl = nextPage ? link + '/' + projectName + '/pages/' + nextPage : nextPage;
                renderData.prevPageUrl = prevPage ? link + '/' + projectName + '/pages/' + prevPage : prevPage;

                var realPath = path.join(__dirname, '../../Projects/' + projectName + '/pages/' + pageName + '.ejs');
                fs.readFile(realPath, "utf-8", function(err, file) {
                    if (err) {
                        console.log(err);
                    } else {
                        modules = getModules(file);
                        var pageSourcePath = [];
                        pageSourcePath.push(projectName + '/pages/' + pageName + '.ejs');
                        renderData.filename = realPath;
                        var html = ejs.render(file, renderData);
                        html = tvvtRender(projectName, html, pageData);
                        renderData.content = html;
                        var source = includeLayout(projectName, pageConfig, renderData);
                        renderData.modules = modules;
                        renderData.pageSource = source;
                        var managerPagePath = path.join(__dirname, '../views/manager/manager_page.ejs');
                        res.render(managerPagePath, renderData);
                    }
                });
            }
        });
    }
}

exports.pagePreview = function(req, res) {
    var clientId = req.query.clientId;
    //如果有clientId 那么连接webSocket

    if (clientId) {
        var userAgent = req.headers['user-agent'];
        ws.send(clientId, 1, JSON.stringify({
            'status': 'ready',
            'user-agent': userAgent
        }));
    };
    var pageName = req.params.name,
        projectName = req.params.projectName,
        modules,
        content;

    utils.checkFileExist(projectName, pageName, function(exists) {
        if (!exists) {
            res.send("404...")
        } else {
            try {
                var pageConfig = require('../../Projects/' + projectName + '/pages/' + pageName + '.config.json'),
                    pageData = requireUncache('../../Projects/' + projectName + '/pages/' + pageName + '.data.json');
            } catch (e) {
                console.log(e);
                var pageConfig = {},
                    pageData = {};
            }
            var renderData = {
                baseUrl: link + '/projects/' + projectName,
                publicUrl: link + '/projects/public',
                managerUrl: link + '/' + projectName,
                link: link,
                moduleConfig: pageConfig,
                pageName: pageName
            }
            utils.extend(renderData, pageData);
            var realPath = path.join(__dirname, '../../Projects/' + projectName + '/pages/' + pageName + '.ejs');

            try {
                var file = fs.readFileSync(realPath, "utf-8");
                renderData.filename = realPath;
                content = ejs.render(file, renderData);
                content = tvvtRender(projectName, content, pageData);
            } catch (e) {
                console.error(e);
            }

            if (clientId) {
                content += "<script src=" + link + "/projects/public/scripts/manager_page_preview.js></script>"
            };

            renderData.content = content;
            var html = includeLayout(projectName, pageConfig, renderData);
            res.charset = 'utf-8';
            res.set('Content-Type', 'text/html');
            res.end(html);
        }
    })
}

exports.downloadPackage = function(req, res) {

    var projectName = req.params.projectName,
        pageName = req.params.name,
        modules,
        content,
        cmd = "mkdir ./temp/components;",
        renderData = {};

    var realPath = path.join(__dirname, '../../Projects/' + projectName + '/pages/' + pageName + '.ejs');
    var file = fs.readFileSync(realPath, "utf-8");
    modules = getModules(file);

    //copy compenents
    for (var i = 0; i < modules.length; i++) {
        cmd += "cp ../Projects/" + projectName + "/components/" + modules[i] + ".ejs temp/components/" + modules[i] + ".ejs;"
    }

    //copy js css ejs
    var downloadPath = [
        "cp ../Projects/" + projectName + "/resource/css/" + pageName + ".css temp/" + pageName + ".css;",
        "cp ../Projects/" + projectName + "/resource/scripts/" + pageName + ".js temp/" + pageName + ".js;",
        "cp ../Projects/" + projectName + "/pages/" + pageName + ".ejs temp/" + pageName + ".ejs;",
        "cp -r ../Projects/" + projectName + "/resource/img temp/img;"
    ]

    for (var i = 0; i < downloadPath.length; i++) {
        cmd += downloadPath[i];
    }

    //生成html文件
    try {
        var pageConfig = require('../../Projects/' + projectName + '/pages/' + pageName + '.config.json'),
            pageData = require('../../Projects/' + projectName + '/pages/' + pageName + '.data.json');
    } catch (e) {
        console.error(e);
        var pageConfig = {},
            pageData = {};
    }
    var renderData = {
        baseUrl: link + '/projects/' + projectName,
        publicUrl: link + '/projects/public',
        managerUrl: link + '/' + projectName,
        link: link,
        moduleConfig: pageConfig,
        pageName: pageName
    }
    utils.extend(renderData, pageData);
    renderData.filename = realPath;
    var html = ejs.render(file, renderData);
    html = tvvtRender(projectName, html, pageData);
    renderData.content = html;
    var source = includeLayout(projectName, pageConfig, renderData);
    var htmlPath = path.join(__dirname, '../temp/' + pageName + '.html');
    var regx = /^[http:\/\/]{1}.+\/projects\/.+\/resource\/(scripts|css|script|images)\//ig;
    source = source.replace(regx, function($0, $1) {
        if ($1 === 'images') {
            return './images/';
        } else {
            return './';
        }
    });
    fs.openSync(htmlPath, 'w', '0777');
    fs.writeFileSync(htmlPath, source, 'utf-8');


    //压缩 并删除原文件 之后再创建temp文件夹
    cmd += "zip -m -r ./downloads/" + pageName + ".zip ./temp;mkdir ./temp";

    try {
        exec(cmd, function(err, stdout, stderr) {
            if (err) {
                console.error(err)
                res.end("error")
            } else {
                var downloadLink = path.join(__dirname, "../downloads/" + pageName + ".zip")
                res.download(downloadLink, pageName + '.zip', function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        exec("rm ./downloads/" + pageName + ".zip", function() {})
                    }
                });
            }

        });
    } catch (e) {
        console.error(e);
    }
}

exports.changeCurPage = function(req, res) {
    var cid = req.body.cid,
        curPage = req.body.curPage;
    ws.send(cid, 2, JSON.stringify({
        'curPage': curPage
    }));
    res.send('1');
}

exports.checkWs = function(req, res) {
    var cid = req.body.cid;
    if (ws.wsGroup[cid]) {
        res.send({
            hasWs: true
        })
    } else {
        res.send({
            hasWs: false
        })
    }
}

/*
    通过name获取moduleConfig.json中的模块配置 return {}
*/

function getModuleConfig(moduleType, name) {
    var data = {};
    for (mt in moduleConfig) {
        if (mt == moduleType) {
            for (module in moduleConfig[mt]) {
                if (module == name) {
                    data = moduleConfig[mt][module];
                    break;
                };
            }
            break;
        };
    }
    return data;
}

function renderData(projectName) {
    return {
        baseUrl: link + '/projects/' + projectName,
        publicUrl: link + '/projects/public',
        managerUrl: link + '/' + projectName,
    }
}

/**
 * [getModuleRenderData 获取模块渲染数据 数据从模块的data.json里来]
 * @param  {[array]} modules＝
 * @return {[data obejct]}
 */

function getModuleRenderData(projectName, modules) {
    var data = {};
    for (var i = 0; i < modules.length; i++) {
        try {
            data[modules[i]] = require('../../Projects/' + projectName + '/components/' + modules[i] + '.data.json')[modules[i]];
        } catch (e) {
            console.log(e);
            data[modules[i]] = {};
        }
    }
    return data;
}

function getHtmls(pathNames, renderData) {
    var htmls = [];
    for (var i = 0; i < pathNames.length; i++) {
        var pathName = path.join(__dirname, '../../Projects/' + pathNames[i]);
        renderData.filename = pathName;
        var html = ejs.render(read(pathName, 'utf8'), renderData);
        htmls.push(html);
    }
    return htmls;
}

function resolveInclude(name, filename) {
    console.log("path is :" + name + "----" + filename);
    var path = path.join(path.dirname(filename), name);
    var ext = path.extname(name);
    if (!ext) path += '.ejs';
    return path;
}

function requireUncache(module) {
    delete require.cache[require.resolve(module)]
    return require(module)
}


//读取page文件 自动判断其中include了几个模块 return [模块数组]

function getModules(fs) {
    var modules = [];
    fs.toString().replace(/<%\s*include{1}\s+\S*\/{1}(\S+)\.ejs{1}\s*\S*%>/ig, function($1, $2) {
        modules.push($2);
    });
    return modules;
}

function getNextPage(pageList, curPage) {
    var nextPage = false;
    pageList.every(function(page, index) {
        if (page == curPage) {
            if (++index > pageList.length) {
                nextPage = false;
            } else {
                nextPage = pageList[index];
            }
            return false;
        } else {
            return true;
        }
    })
    return nextPage;
}

function getPrevPage(pageList, curPage) {
    var prevPage = false;
    pageList.every(function(page, index) {
        if (page == curPage) {
            if (--index < 0) {
                prevPage = false;
            } else {
                prevPage = pageList[index];
            }
            return false;
        } else {
            return true;
        }
    })
    return prevPage;
}

function includeLayout(projectName, pageConfig, renderData) {
    var source = '';
    if (pageConfig.layout) {
        source = getHtmls([projectName + '/layouts/' + pageConfig.layout], renderData)[0];
    } else if (fs.existsSync(path.join(__dirname, '../../Projects/' + projectName + '/layouts/layout.ejs'))) {
        source = getHtmls([projectName + '/layouts/layout.ejs'], renderData)[0];
    } else {
        source = getHtmls(['public/layouts/layout.ejs'], renderData)[0];
    }
    return source;
}
