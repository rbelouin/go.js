function init$Board() {
  var $Board = function(settings) {
    var $board = {};

    $board.elem = d3.select(settings && settings.selector);
    $board.size = settings && settings.size;

    var size = $Board.getSize($board);

    var $grids = $board.elem.append("g")
      .classed("grids", true)
      .attr("transform", "translate(" + size.width + ", " + size.height + ")");
    
    var $hGrids = $grids.append("g").classed("h-grids", true);
    var $vGrids = $grids.append("g").classed("v-grids", true);

    _.each(_.range(0, $board.size), function(n) {
      $hGrids
        .append("g").attr("transform", "translate(0, " + size.height*n + ")")
        .append("line").attr({
          x2: ($board.size - 1) * size.width,
          y2: 0
        });

      $vGrids
        .append("g").attr("transform", "translate(" + size.width*n + ", 0)")
        .append("line").attr({
          x2: 0,
          y2: ($board.size - 1) * size.height
        });
    });

    var $stones = $board.elem.append('g').classed('stones', true).attr('transform', 'translate(' + size.width + ', ' + size.height + ')');

    return $board;
  };

  $Board.getSize = function($board) {
    return {
      height: parseInt($board.elem.attr("height") || "0") / ($board.size + 1),
      width: parseInt($board.elem.attr("width") || "0") / ($board.size + 1)
    };
  };

  $Board.addStone = function($board, x, y, color) {
    var size = $Board.getSize($board);
    var $stones = $board.elem.select(".stones");

    $stones
      .insert("g")
        .classed("stone", true)
        .classed(color, true)
        .attr("transform", "translate(" + (size.width*x) + ", " + (size.height*y) + ")")
      .insert("circle")
        .attr("r", d3.min([size.height, size.width]) * 2 / 5);
  };

  return $Board;
};
