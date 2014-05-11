function initClient(initWSClient, initWebRTCClient) {
  var WSClient = initWSClient();
  var WebRTCClient = initWebRTCClient();

  var Client = function(settings) {
    return {
      ws: WSClient({
        host: settings && settings.host
      }),
      webrtc: WebRTCClient()
    };
  };

  Client.initChannel = function(webrtcClient, socket) {
    var p_color = new Promise();

    socket.on("WAITING_FOR_OFFER", function() {
      WebRTCClient.createOffer(webrtcClient).map(function(offer) {
        socket.emit("OFFER", offer);
      });
    });

    socket.on("OFFER", function(offer) {
      WebRTCClient.receiveOffer(webrtcClient, offer).map(function(answer) {
        socket.emit("ANSWER", answer);
        p_color.resolve(Board.types.WHITE);
      });
    });

    socket.on("ANSWER", function(answer) {
      WebRTCClient.receiveAnswer(webrtcClient, answer);
      p_color.resolve(Board.types.BLACK);
    });

    socket.emit("JOIN");

    return p_color.chain(function(color) {
      return webrtcClient.channel.map(function(channel) {
        channel.color = color;
        return channel;
      });
    });
  };

  Client.startChannel = function(client) {
    WSClient.connect(client.ws);
    return client.ws.socket.chain(_.partial(Client.initChannel, client.webrtc));
  };

  return Client;
}
