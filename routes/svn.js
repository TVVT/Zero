var exec = require('child_process').exec;

exports.svnup = function(req,res){
    var testcmd = 'pgrep svn';
    // 获取svn更新路径，如果没有更新路径则默认为全局
    var cmd = 'cd /home/whtest/server/tvvt && svn up';
    exec(testcmd,function(err,stdout,stderr){
        if(stdout){
           res.status(500).end('其他同事更新svn中....去群里吼下吧！');
        }else{
           exec(cmd, function(err, stdout, stderr) {
                if (err) {
                    res.status(500).end(err.toString());
                } else {
                    res.end(stdout);
                }
            });
        }
    })
}




