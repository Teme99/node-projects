const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

let mimeTypes = {
    "html" : "text/html",
    "jpeg" : "image/jpeg",
    "jpg" : "image/jpeg",
    "png" : "image/png",
    "js" : "text/javascript",
    "css" : "text/css"
}
// creating server
http.createServer(function(req, res){
    let uri = url.parse(req.url).pathname;
    let fileName = path.join(process.cwd(),unescape(uri));
    console.log('Loading ' + uri);
    var stats;

    try{
        stats = fs.lstatSync(fileName);
    }catch(e){
        res.writeHead(404, {'Content-type': 'text/plain'});
        res.write('404 Not Found \n');
        res.end();
        return;
    }

    //check if file/dir
    if(stats.isFile()){
        let mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
        res.writeHead(200, {'Content-type': mimeType});

        let fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    } else if (fs.stat.isDirectory()){
        res.writeHead(302, {
            'Location': 'index.html'
        });
        res.end();
    } else{
        res.writeHead(500, {'Content-Type' : 'text/plain'});
        res.write('500 INternal Error \n');
        res.end();
    }
}).listen(3000);