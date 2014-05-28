var http = require("http");
var static = require("node-static");
var socketIO = require("socket.io");

var staticServer = new static.Server(".");
var server = http.createServer(function(request, response) {
  request.addListener("end", function() {
    staticServer.serve(request, response);
  }).resume();
});

var io = socketIO.listen(server);

io.sockets.on("connection", function(socket) {
  socket.on("message", function(message) {
    socket.emit("message", message);
  });
});

exports.start = function() {
  server.listen(8080);
};

exports.stop = function() {
  server.close();
};
