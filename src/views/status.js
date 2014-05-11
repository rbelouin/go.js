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

  $Status.update = function($status, message) {
    $status.elem.text(message);
  };

  return $Status;
};
