var http = require("http");
var static = require("node-static");
var socketIO = require("socket.io");

exports.start = function() {
  var staticServer = new static.Server(".");

  var server = http.createServer(function(request, response) {
    request.addListener("end", function() {
      staticServer.serve(request, response);
    }).resume();
  }).listen(8080);

  var io = socketIO.listen(server);

  io.sockets.on("connection", function(socket) {
    socket.on("message", function(message) {
      socket.emit("message", message);
    });
  });
};
