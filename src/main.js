var Board = initBoard();
var $Board = init$Board();
var $Pass = init$Pass();
var $Status = init$Status();
var GameController = initGameController();
var Client = initClient(initWSClient, initWebRTCClient);

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

var game2message = function(color, game) {
  var opponentColor = color == Board.types.BLACK ? Board.types.WHITE : Board.types.BLACK;
  return (game.blackTurn == (color === Board.types.BLACK)) ? "It's your turn." : "It's " + opponentColor.toLowerCase() + " turn.";
};

var client = Client({host: "http://127.0.0.1:8080"});

Client.startChannel(client).map(function(channel) {
  var controller = GameController({
    isBlack: channel.color == Board.types.BLACK,
    size: 13
  });

  var $board = $Board({
    selector: "svg.board",
    size: 13
  });

  var $pass = $Pass({
    selector: "button.pass"
  });

  var $status = $Status({
    selector: ".status"
  });

  var $boardClicks = $board.clicks.map(_.partial(coordinates2command, channel.color));
  var $passClicks = $pass.clicks.map(_.partial(pass2command, channel.color));

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
  controller.gameStates.map(_.partial(game2message, channel.color)).onValue(_.partial($Status.update, $status));
  controller.gameStates.onEnd(function() {
    alert("The game is over.");
  });

  $Status.update($status, channel.color == Board.types.BLACK ? "You're black, you begin." : "You're white, it's your opponent turn.");
});
