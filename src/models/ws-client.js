function initWSClient() {
  var WSClient = function(settings) {
    return {
      host: settings.host,
      socket: new Promise(),
      stream: new Bacon.Bus()
    };
  };

  WSClient.connect = function(client) {
    var socket = io.connect(client.host);

    socket.on("connect", function() {
      client.socket.resolve(socket);

      socket.on("message", function(message) {
        client.stream.push(message);
      });
      socket.on("disconnect", function() {
        client.stream.end();
      });
    });
  };

  WSClient.send = function(client, message) {
    client.socket.map(function(socket) {
      socket.emit("message", message);
    });
  };

  return WSClient;
}
