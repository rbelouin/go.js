var Board = initBoard();
var $Board = init$Board();
var $Pass = init$Pass();
var GameController = initGameController();
var WebRTCClient = initWebRTCClient();
var WSClient = initWSClient();

var coordinates2command = function(color, coordinates) {
  return {
    type: "PLAY",
    color: color,
    x: coordinates.x,
    y: coordinates.y
  };
};

var pass2command = function(color) {
  return {
    type: "PASS",
    color: color
  };
};

var game2board = function(game) {
  return game.board;
};

var wsClient = WSClient({host: "http://127.0.0.1:8080"});
WSClient.connect(wsClient);

var webrtcClient = WebRTCClient();

var p_color = wsClient.socket.chain(function(socket) {
  var result = new Promise();

  socket.on("WAITING_FOR_OFFER", function() {
    WebRTCClient.createOffer(webrtcClient).map(function(offer) {
      socket.emit("OFFER", offer);
    });
  });

  socket.on("OFFER", function(offer) {
    WebRTCClient.receiveOffer(webrtcClient, offer).map(function(answer) {
      socket.emit("ANSWER", answer);
      result.resolve(Board.types.WHITE);
    });
  });

  socket.on("ANSWER", function(answer) {
    WebRTCClient.receiveAnswer(webrtcClient, answer);
    result.resolve(Board.types.BLACK);
  });

  socket.emit("JOIN");

  return result;
});

var p_channel = p_color.chain(function(color) {
  return webrtcClient.channel.map(function(channel) {
    channel.type = color;
    return channel;
  });
});

p_channel.map(function(channel) {
  var controller = GameController({
    isBlack: channel.type == Board.types.BLACK,
    size: 13
  });

  var $board = $Board({
    selector: "svg.board",
    size: 13
  });

  var $pass = $Pass({
    selector: "button.pass"
  });

  var $boardClicks = $board.clicks.map(_.partial(coordinates2command, channel.type));
  var $passClicks = $pass.clicks.map(_.partial(pass2command, channel.type));

  var $commands = $boardClicks.merge($passClicks);

  $commands.onValue(_.partial(GameController.play, controller));
  $commands.onValue(function(command) {
    channel.send(JSON.stringify(command));
  });

  channel.onmessage = function(message) {
    var command = JSON.parse(message.data);
    GameController.play(controller, command);
  };

  controller.gameStates.map(game2board).onValue(_.partial($Board.displayBoard, $board));
});
