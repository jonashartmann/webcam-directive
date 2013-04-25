var st = require('node-static');

//
// Create a node-static server instance to serve the './app' folder
//
var file = new(st.Server)('./app');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(request, response);
    });
}).listen(8080);

console.log('Serving static files on port 8080');