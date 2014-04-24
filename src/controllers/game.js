function initGameController() {
  var Board = initBoard();
  var Game = initGame(Board);

  var GameController = function(settings) {
    var controller = {};

    controller.game = Game(settings);
    controller.isBlack = settings && settings.isBlack;

    return controller;
  };

  GameController.play = function(controller, command) {
    var result = Game.processCommand(controller.game, command);

    result.map(function(game) {
      controller.game = game;

      if(game.cumulativePassings >= 2) {
        Controller.end(controller);
      }
    });

    result.mapError(function(error) {
      console.error(error.message);
    });
  };

  GameController.end = function(controller) {
    alert("Game is over!");
  };

  return GameController;
};
