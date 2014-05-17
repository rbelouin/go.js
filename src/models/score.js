function initScore(initBoard) {
  var Board = initBoard();
  var Score = {};

  Score.scoreFromGame = function(color, game) {
    var groups = Board.getGroups(game.board);
    var encircledGroups = Board.getEncircledGroups(groups);

    var territories = _.chain(encircledGroups[Board.types.EMPTY])
      .groupBy(function(territory) {
        return territory.neighborTypes && territory.neighborTypes[0];
      })
      .mapValues(function(territories, color) {
        return _.foldl(territories, function(total, territory) {
          return total + _.size(territory.intersections);
        }, 0);
      })
      .value();

    var scores = _.mapValues(game.prisoners, function(prisoners, color) {
      return {
        prisoners: prisoners,
        intersections: territories[color] || 0
      };
    });

    var global = (color == Board.types.BLACK ? -1 : 1) * (6.5 +
      (scores[Board.types.WHITE].intersections || 0) - scores[Board.types.WHITE].prisoners -
      (scores[Board.types.BLACK].intersections || 0) + scores[Board.types.BLACK].prisoners);

    return _.extend(scores, {global: global});
  };

  return Score;
}
