var Board = initBoard();

describe("Board", function() {
  it("should create an empty board", function() {
    var board = Board(13);

    var isEmpty = _.all(board, function(intersection) {
      return intersection.type == Board.types.EMPTY;
    });

    expect(isEmpty).toBe(true);
  });
});

describe("Board.clone", function() {
  it("should create a board with a new reference", function() {
    var board = Board(13);
    var boardCopy = Board.clone(board);

    expect(board).not.toBe(boardCopy);
  });

  it("shouldn't mutate the initial board, if a stone type is manually modified", function() {
    var board = Board(13);
    var boardCopy = Board.clone(board);

    var intersection = Board.getIntersection(boardCopy, 0, 0);
    intersection.type = Board.types.BLACK;

    var initialIntersection = Board.getIntersection(board, 0, 0);

    expect(initialIntersection.type).not.toBe(intersection.type);
  });
});

describe("Board.getIntersection", function() {
  it("should be able to get the intersection placed at (0, 0)", function() {
    var board = Board(13);
    var intersection = Board.getIntersection(board, 0, 0);

    expect(intersection && intersection.x == 0 && intersection.y == 0).toBe(true);
  });
});

describe("Board.setIntersection", function() {
  it("should be able to make black the intersection placed at (0, 0)", function() {
    var board = Board(13);
    Board.setIntersection(board, 0, 0, Board.types.BLACK);

    var intersection = Board.getIntersection(board, 0, 0);

    expect(intersection && intersection.type).toBe(Board.types.BLACK);
  });
});

describe("Board.getAndRemoveIntersection", function() {
  it("should make the board one element smaller that before", function() {
    var board = Board(13);
    var initialSize = _.size(board);
    
    Board.getAndRemoveIntersection(board, 0, 0);
    var newSize = _.size(board);

    expect(initialSize - newSize).toBe(1);
  });

  it("should return the right element", function() {
    var board = Board(13);
    var intersection = Board.getIntersection(board, 0, 0);

    var intersection2 = Board.getAndRemoveIntersection(board, 0, 0);

    expect(intersection2).toBe(intersection);
  });

  it("should make the given intersection removed from the board", function() {
    var board = Board(13);
    Board.getAndRemoveIntersection(board, 0, 0);

    expect(Board.getIntersection(board, 0, 0)).toBeUndefined();
  });
});

describe("Board.emptyIntersections", function() {
  it("should empty the given intersections", function() {
    var board = Board(13);
    var coordinatesSet = [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}];

    _.each(coordinatesSet, function(coordinates) {
      Board.setIntersection(board, coordinates.x, coordinates.y, Board.types.BLACK);
    });

    Board.emptyIntersections(board, _.map(coordinatesSet, function(coordinates) {
      return Board.getIntersection(board, coordinates.x, coordinates.y);
    }));

    var areEmpty = _.all(coordinatesSet, function(coordinates) {
      return Board.getIntersection(board, coordinates.x, coordinates.y).type == Board.types.EMPTY;
    });

    expect(areEmpty).toBe(true);
  });
});

describe("Board.getNeighborIntersections", function() {
  it("should return all neighbors", function() {
    var board = Board(13);

    var neighbors = Board.getNeighborIntersections(board, 1, 1);
    var neighborCoordinatesSet = [{x: 0, y: 1}, {x: 2, y: 1}, {x: 1, y: 0}, {x: 1, y: 2}];

    var allNeighbors = _.all(neighborCoordinatesSet, function(coordinates) {
      return _.any(neighbors, function(neighbor) {
        return coordinates.x == neighbor.x && coordinates.y == neighbor.y;
      });
    });

    expect(allNeighbors).toBe(true);
  });

  it("should return only two neighbors for the intersection placed on (0, 0)", function() {
    var board = Board(13);
    var neighbors = Board.getNeighborIntersections(board, 0, 0);

    expect(_.size(neighbors)).toBe(2);
  });
});
