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

    $board.clicks = Bacon.fromBinder(function(sink) {
      $board.elem.on("click", function() {
        sink(d3.mouse($board.elem.node()));
      });
    }).map(_.partial($Board.mouseEvent2coordinates, $board));

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

  $Board.mouseEvent2coordinates = function($board, mouse) {
    var size = $Board.getSize($board);
    var x = Math.round(mouse[0] / size.width - 1);
    var y = Math.round(mouse[1] / size.height - 1);

    return {
      x: x < 0 ? 0 : x,
      y: y < 0 ? 0 : y
    };
  };

  $Board.displayBoard = function($board, board) {
    var $stones = $board.elem.select(".stones");
    $stones.selectAll(".stone").remove();

    _.each(board, function(intersection) {
      if(intersection.type != Board.types.EMPTY) {
        $Board.addStone($board, intersection.x, intersection.y, intersection.type);
      }
    });
  };

  return $Board;
};
