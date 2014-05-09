var http = require("http");
var static = require("node-static");
var socketIO = require("socket.io");

var staticServer = new static.Server(".");

var server = http.createServer(function(request, response) {
  request.addListener("end", function() {
    staticServer.serve(request, response);
  }).resume();
}).listen(8080);

var io = socketIO.listen(server);

var waitingSocket = null;

io.sockets.on("connection", function(socket) {
  socket.on("JOIN", function() {
    if(waitingSocket) {
      waitingSocket.on("OFFER", function(offer) {
        socket.on("ANSWER", function(answer) {
          waitingSocket.emit("ANSWER", answer);
        });
        socket.emit("OFFER", offer);
      });
      waitingSocket.emit("WAITING_FOR_OFFER");
    }
    else {
      console.log("wainting…");
      waitingSocket = socket;
    }
  });

  socket.on("disconnect", function() {
    if(waitingSocket === socket) {
      waitingSocket = null;
    }
  });
});
