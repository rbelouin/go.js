function initGame(Board) {
  var Game = function(settings) {
    var prisoners = _.foldl([Board.types.BLACK, Board.types.WHITE], function(prisoners, color) {
      prisoners[color] = 0;
      return prisoners;
    }, {});

    return {
      blackTurn: true,
      board: Board(settings.size),
      history: [],
      prisoners: prisoners,
      cumulativePassings: 0
    };
  };

  Game.checkTurn = function(game, command) {
    var result = new Promise();

    if((command.color == Board.types.BLACK) != game.blackTurn) {
      result.reject({
        message: "Not your turn!"
      });
    }
    else {
      result.resolve();
    }

    return result;
  };

  Game.checkEmpty = function(game, command) {
    var board = game.board;
    var x = command.x;
    var y = command.y;

    var result = new Promise();

    if(Board.getIntersection(board, x, y).type != Board.types.EMPTY) {
      result.reject({
        message: "(" + x + "," + y + ") is not empty!"
      });
    }
    else {
      result.resolve();
    }

    return result;
  };

  Game.checkSuicide = function(encircled, type, opponentType) {
    var result = new Promise();

    var encircledGroups = _.size(encircled[type]);
    var opponentEncircledGroups = _.size(encircled[opponentType]);

    if(encircledGroups > 0 && opponentEncircledGroups == 0 && _.any(encircled[type], function(group) {
      return _.first(group.neighborTypes) == opponentType;
    })) {
      result.reject({
        message: "No suicide, please!"
      });
    }
    else {
      result.resolve();
    }

    return result;
  };

  Game.checkKo = function(board, history) {
    var result = new Promise();

    if(JSON.stringify(board) == JSON.stringify(_.last(history))) {
      result.reject({
        message: "Taking this stone is forbidden!"
      });
    }
    else {
      result.resolve();
    }

    return result;
  };

  Game.pass = function(game, command) {
    return Game.checkTurn(game, command).map(function() {
      return _.extend(game, {
        blackTurn: !game.blackTurn,
        cumulativePassings: game.cumulativePassings + 1
      });
    });
  };

  Game.play = function(game, command) {
    var board = game.board;
    var history = game.history;
    var x = command.x;
    var y = command.y;

    var result = new Promise();

    return Promise.of()
      .chain(function() {
        return Game.checkTurn(game, command);
      })
      .chain(function() {
        return Game.checkEmpty(game, command);
      })
      .chain(function() {
        var nextBoard = Board.clone(board);
        var type = game.blackTurn ? Board.types.BLACK : Board.types.WHITE;
        var opponentType = type == Board.types.WHITE ? Board.types.BLACK : Board.types.WHITE;

        Board.setIntersection(nextBoard, x, y, type);

        var groups = Board.getGroups(Board.clone(nextBoard));
        var encircled = Board.getEncircledGroups(groups);

        return Promise.of()
          .chain(function() {
            return Game.checkSuicide(game, encircled, type, opponentType);
          })
          .chain(function() {
            var intersectionsToRemove = _.foldl(encircled[opponentType], function(intersections, group) {
              return group.neighborTypes[0] == type ? _.union(intersections, group.intersections) : intersections;
            }, []);

            nextBoard = Board.emptyIntersections(nextBoard, intersectionsToRemove);

            return Game.checkKo(game, nextBoard, history).map(function() {
              var prisoners = _.foldl([Board.types.BLACK, Board.types.WHITE], function(prisoners, color) {
                prisoners[color] = game.prisoners[color] + (opponentType == color ? _.size(intersectionsToRemove) : 0);
                return prisoners;
              }, {});

              return {
                blackTurn: !game.blackTurn,
                board: nextBoard,
                history: history.concat([board]),
                prisoners: prisoners,
                cumulativePassings: 0
              };
            });
          });
      });
  };

  Game.processCommand = function(game, command) {
    switch(command.type) {
      case "PASS":
        return Game.pass(game, command);
        break;
      case "PLAY":
        return Game.play(game, command);
        break;
    }
  };

  return Game;
};
