function init$Status() {
  var $Status = function(settings) {
    var $status = {};

    $status.elem = d3.select(settings && settings.selector);

    $status.clicks = Bacon.fromBinder(function(sink) {
      $status.elem.on("click", function() {
        sink();
      });
    });

    return $status;
  };

  $Status.start = function($status) {
    $status.timer = Bacon.interval(1000, 1).scan(0, function(acc, n) {
      return acc + n;
    });

    $status.timer.onValue(function(seconds) {
      var min = Math.floor(seconds / 60);
      var sec = seconds % 60;

      $status.elem.select(".time").text((min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec));
    });
  };

  $Status.update = function($status, message) {
    $status.elem.select(".status").text(message);
  };

  return $Status;
};
