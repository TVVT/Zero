// server.js
var qr = require('qr-image');  


exports.qr = function (req,res) {
    var url = req.query.url;
    if(url){
        var code = qr.image(url, { type: 'png', size:4});
        res.type('png');
        code.pipe(res);
    }else{
        res.end(null);
    }
}
