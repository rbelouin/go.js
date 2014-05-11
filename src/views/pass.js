function init$Pass() {
  var $Pass = function(settings) {
    var $pass = {};

    $pass.elem = d3.select(settings && settings.selector);

    $pass.clicks = Bacon.fromBinder(function(sink) {
      $pass.elem.on("click", function() {
        sink();
      });
    });

    return $pass;
  };

  return $Pass;
};
