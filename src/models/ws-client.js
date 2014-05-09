function initWSClient() {
  var WSClient = function(settings) {
    return {
      host: settings.host,
      socket: new Promise()
    };
  };

  WSClient.connect = function(client) {
    var socket = io.connect(client.host);

    socket.on("connect", function() {
      client.socket.resolve(socket);
    });
  };

  WSClient.send = function(client, message, data) {
    client.socket.map(function(socket) {
      socket.emit(message, data);
    });
  };

  return WSClient;
}
