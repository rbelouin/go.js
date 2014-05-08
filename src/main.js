var Board = initBoard();
var $Board = init$Board();
var GameController = initGameController();
var WebRTCClient = initWebRTCClient();

var blackController = GameController({
  isBlack: true,
  size: 13
});

var whiteController = GameController({
  isBlack: false,
  size: 13
});

var $blackBoard = $Board({
  selector: "svg.board.BLACK",
  size: 13
});

var $whiteBoard = $Board({
  selector: "svg.board.WHITE",
  size: 13
});

var blackClient = WebRTCClient();
var whiteClient = WebRTCClient();

var p_offer = WebRTCClient.createOffer(blackClient);
var p_answer = p_offer.chain(function(offer) {
  return WebRTCClient.receiveOffer(whiteClient, offer);
});
var p_ready = p_answer.chain(function(answer) {
  WebRTCClient.receiveAnswer(blackClient, answer);

  return blackClient.channel.conjoin(whiteClient.channel);
});

var coordinates2command = function(color, coordinates) {
  return {
    type: "PLAY",
    color: color,
    x: coordinates.x,
    y: coordinates.y
  };
};

var game2board = function(game) {
  return game.board;
};

p_ready.spread(function(blackChannel, whiteChannel) {
  var $blackCommands = $blackBoard.clicks.map(_.partial(coordinates2command, Board.types.BLACK));
  var $whiteCommands = $whiteBoard.clicks.map(_.partial(coordinates2command, Board.types.WHITE));

  $blackCommands.onValue(_.partial(GameController.play, blackController));
  $blackCommands.onValue(function(command) {
    blackChannel.send(JSON.stringify(command));
  });

  blackChannel.onmessage = function(message) {
    var command = JSON.parse(message.data);
    GameController.play(blackController, command);
  };

  $whiteCommands.onValue(_.partial(GameController.play, whiteController));
  $whiteCommands.onValue(function(command) {
    whiteChannel.send(JSON.stringify(command));
  });

  whiteChannel.onmessage = function(message) {
    var command = JSON.parse(message.data);
    GameController.play(whiteController, command);
  };

  blackController.gameStates.map(game2board).onValue(_.partial($Board.displayBoard, $blackBoard));
  whiteController.gameStates.map(game2board).onValue(_.partial($Board.displayBoard, $whiteBoard));
});
