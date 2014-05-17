function init$Score() {
  var $Score = function(settings) {
    var $score = {};

    $score.elem = d3.select(settings && settings.selector);

    return $score;
  };

  $Score.update = function($score, score) {
    $score.elem.select(".score").text(score.global);

    $score.elem.select(".black .territory").text(score[Board.types.BLACK].intersections);
    $score.elem.select(".white .territory").text(score[Board.types.WHITE].intersections);

    $score.elem.select(".black .prisoners").text(score[Board.types.WHITE].prisoners);
    $score.elem.select(".white .prisoners").text(score[Board.types.BLACK].prisoners);
  };

  return $Score;
};
