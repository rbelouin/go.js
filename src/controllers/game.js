function initGameController() {
  var Board = initBoard();
  var Game = initGame(Board);

  var GameController = function(settings) {
    var controller = {};

    controller.game = Game(settings);
    controller.isBlack = settings && settings.isBlack;
    controller.gameStates = new Bacon.Bus();

    return controller;
  };

  GameController.play = function(controller, command) {
    var result = Game.processCommand(controller.game, command);

    result.map(function(game) {
      controller.game = game;
      controller.gameStates.push(game);

      if(game.cumulativePassings >= 2) {
        controller.gameStates.end();
      }
    });

    result.mapError(function(error) {
      console.error(error.message);
    });
  };

  return GameController;
};
