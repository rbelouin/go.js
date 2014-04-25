var Board = initBoard();
var $Board = init$Board();
var GameController = initGameController();

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

var coordinates2command = function(color, coordinates) {
  return {
    type: "PLAY",
    color: color,
    x: coordinates.x,
    y: coordinates.y
  };
};

var $blackCommands = $blackBoard.clicks.map(_.partial(coordinates2command, Board.types.BLACK));
var $whiteCommands = $whiteBoard.clicks.map(_.partial(coordinates2command, Board.types.WHITE));

$blackCommands.onValue(_.partial(GameController.play, blackController));
$blackCommands.onValue(_.partial(GameController.play, whiteController));

$whiteCommands.onValue(_.partial(GameController.play, blackController));
$whiteCommands.onValue(_.partial(GameController.play, whiteController));

var game2board = function(game) {
  return game.board;
};

blackController.gameStates.map(game2board).onValue(_.partial($Board.displayBoard, $blackBoard));
whiteController.gameStates.map(game2board).onValue(_.partial($Board.displayBoard, $whiteBoard));
