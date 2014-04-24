var Board = initBoard();
var Game = initGame(Board);

describe("Game()", function() {
  it("should make black player start", function() {
    var game = Game({
      size: 13
    });

    expect(game.blackTurn).toBe(true);
  });
});

describe("Game.checkTurn", function() {
  it("should fail if white player plays during black turn", function(done) {
    var game = Game({
      size: 13
    });

    var result = Game.checkTurn(game, {
      type: "PLAY",
      color: Board.types.WHITE,
      x: 0,
      y: 0
    });

    var oncomplete = function() {
      expect(result.rejected).toBe(true);
      done();
    };

    result.then(oncomplete, oncomplete);
  });
});

describe("Game.checkEmpty", function() {
  it("should fail if white player plays where black player just played", function(done) {
    var game = Game({
      size: 13
    });

    Board.setIntersection(game.board, 0, 0, Board.types.BLACK);

    var result = Game.checkEmpty(game, {
      type: "PLAY",
      color: Board.types.WHITE,
      x: 0,
      y: 0
    });

    var oncomplete = function() {
      expect(result.rejected).toBe(true);
      done();
    };

    result.then(oncomplete, oncomplete);
  });
});

describe("Game.checkSuicide", function() {
  it("should fail if white player tries to play between between black stones", function(done) {
    var game = Game({
      size: 13
    });

    var board = Board.clone(game.board);
    Board.setIntersection(board, 1, 0, Board.types.BLACK);
    Board.setIntersection(board, 0, 1, Board.types.BLACK);
    Board.setIntersection(board, 1, 2, Board.types.BLACK);
    Board.setIntersection(board, 2, 1, Board.types.BLACK);
    Board.setIntersection(board, 1, 1, Board.types.WHITE);

    var groups = Board.getGroups(board);
    var encircled = Board.getEncircledGroups(groups);

    var result = Game.checkSuicide(encircled, Board.types.WHITE, Board.types.BLACK);

    var oncomplete = function() {
      expect(result.rejected).toBe(true);
      done();
    };

    result.then(oncomplete, oncomplete);
  });
});

describe("Game.checkKo", function() {
  it("should fail if black player tries to play a ko", function(done) {
    var game = Game({
      size: 13
    });

    var turn1 = Board.clone(game.board);
    Board.setIntersection(turn1, 0, 0, Board.types.BLACK);
    Board.setIntersection(turn1, 3, 0, Board.types.WHITE);
    Board.setIntersection(turn1, 1, 1, Board.types.BLACK);
    Board.setIntersection(turn1, 2, 1, Board.types.WHITE);
    Board.setIntersection(turn1, 2, 0, Board.types.BLACK);

    var turn2 = Board.clone(turn1);
    Board.setIntersection(turn2, 1, 0, Board.types.WHITE);
    Board.setIntersection(turn2, 2, 0, Board.types.EMPTY);

    var turn3 = Board.clone(turn2);
    Board.setIntersection(turn3, 2, 0, Board.types.BLACK);
    Board.setIntersection(turn3, 1, 0, Board.types.EMPTY);

    var result = Game.checkKo(turn3, [turn1]);

    var oncomplete = function() {
      expect(result.rejected).toBe(true);
      done();
    };

    result.then(oncomplete, oncomplete);
  });
});

describe("Game.pass", function() {
  it("should switch turn", function(done) {
    var game = Game({
      size: 13
    });

    var result = Game.pass(game, {type: "PASS", color: Board.types.BLACK});

    var oncomplete = function(newGame) {
      expect(result.resolved).toBe(true);
      expect(newGame && newGame.blackTurn).toBe(false);
      done();
    };

    result.then(oncomplete, oncomplete);
  });

  it("should increment cumulativePassings game property", function() {
    var game = Game({
      size: 13
    });

    var result = Game.pass(game, {type: "PASS", color: Board.types.BLACK});

    var oncomplete = function(newGame) {
      expect(result.resolved).toBe(true);
      expect(newGame && newGame.cumulativePassings).toBe(1);
      done();
    };

    result.then(oncomplete, oncomplete);
  });
});

describe("Game.play", function() {
  it("should switch turn, if command is correct", function(done) {
    var game = Game({
      size: 13
    });

    var result = Game.play(game, {
      type: "PLAY",
      color: Board.types.BLACK,
      x: 0,
      y: 0
    });

    var oncomplete = function(newGame) {
      expect(result.resolved).toBe(true);
      expect(newGame && newGame.blackTurn).toBe(false);
      done();
    };

    result.then(oncomplete, oncomplete);
  });

  it("should reset cumulativePassings game property to 0", function() {
    var game = Game({
      size: 13
    });

    var result = Game.pass(game, {type: "PASS", color: Board.types.BLACK}).chain(function(game) {
      return Game.play(game, {
        type: "PLAY",
        color: Board.types.WHITE,
        x: 1,
        y: 1
      });
    });

    var oncomplete = function(newGame) {
      expect(result.resolved).toBe(true);
      expect(newGame && newGame.cumulativePassings).toBe(0);
      done();
    };

    result.then(oncomplete, oncomplete);
  });
});
