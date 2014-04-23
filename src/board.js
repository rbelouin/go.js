function initBoard() {
  var Board = function(size) {
    var range = _.range(size);
    var board = {};

    _.each(range, function(x) {
      _.each(range, function(y) {
        Board.setIntersection(board, x, y, Board.types.EMPTY);
      });
    });

    return board;
  }

  Board.types = {
    EMPTY: "EMPTY",
    BLACK: "BLACK",
    WHITE: "WHITE"
  };

  Board.clone = function(board) {
    return _.clone(board, true);
  };

  Board.getIntersection = function(board, x, y) {
    return board[x + "," + y];
  };

  Board.setIntersection = function(board, x, y, type) {
    board[x + "," + y] = {
      x: x,
      y: y,
      type: type
    };
  };

  Board.getAndRemoveIntersection = function(board, x, y) {
    var intersection = Board.getIntersection(board, x, y);

    board[x + "," + y] = null;
    delete board[x + "," + y];

    return intersection;
  };

  Board.emptyIntersections = function(board, intersections) {
    _.each(intersections, function(intersection) {
      Board.setIntersection(board, intersection.x, intersection.y, Board.types.EMPTY);
    });

    return board;
  };

  Board.getNeighborIntersections = function(board, x, y) {
    return _.compact([
      Board.getIntersection(board, x, y - 1),
      Board.getIntersection(board, x + 1, y),
      Board.getIntersection(board, x, y + 1),
      Board.getIntersection(board, x - 1, y)
    ]);
  };

  Board.getGroups = function(board) {
    var getGroup = function(boardCopy) {
      var addIntersectionToGroup = function(group, x, y) {
        var neighbors = Board.getNeighborIntersections(boardCopy, x, y);
        var initialNeighbors = Board.getNeighborIntersections(board, x, y);

        var intersection = Board.getAndRemoveIntersection(boardCopy, x, y);

        if(!intersection) {
          return group;
        }
        else {
          var newGroup = {
            intersections: group.intersections.concat([intersection]),
            neighborTypes: _.foldl(initialNeighbors, function(types, neighbor) {
              return neighbor.type == intersection.type ? types : _.union(types, [neighbor.type]);
            }, group.neighborTypes)
          };

          return _.foldl(neighbors, function(group, neighbor) {
            return neighbor.type == intersection.type ? addIntersectionToGroup(group, neighbor.x, neighbor.y) : group;
          }, newGroup);
        }
      };

      var first = _.find(boardCopy, function() { return true; });
      var emptyGroup = {intersections: [], neighborTypes: []};

      return first && addIntersectionToGroup(emptyGroup, first.x, first.y);
    };

    var addGroup = function(groups, boardCopy) {
      var group = getGroup(boardCopy);

      if(!group) {
        return groups;
      }
      else {
        var groupType = group.intersections[0].type;
        groups[groupType] = _.union(groups[groupType], [group]);

        return addGroup(groups, boardCopy);
      }
    };

    return addGroup({}, Board.clone(board));
  };

  Board.getEncircledGroups = function(groups) {
    return _.mapValues(groups, function(typedGroups) {
      return _.filter(typedGroups, function(group) {
        return _.size(group.neighborTypes) == 1;
      });
    });
  };

  return Board;
}
