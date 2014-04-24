var Board = initBoard();
var $Board = init$Board();

describe("$Board()", function() {
  beforeEach(function() {
    d3.select("body").append("svg:svg")
      .attr("height", "400")
      .attr("width", "400")
      .classed("board", true);

    this.$board = $Board({
      selector: "svg.board",
      size: 13
    });
  });

  afterEach(function() {
    d3.selectAll("svg.board").remove();
  });

  it("should draw n horizontal lines", function() {
    expect(this.$board.elem.selectAll(".grids .h-grids g").size()).toBe(13);
  });

  it("should draw n vertical lines", function() {
    expect(this.$board.elem.selectAll(".grids .v-grids g").size()).toBe(13);
  });
});

describe("$Board.getSize", function() {
  beforeEach(function() {
    d3.select("body").append("svg:svg")
      .attr("height", "400")
      .attr("width", "400")
      .classed("board", true);

    this.$board = $Board({
      selector: "svg.board",
      size: 13
    });
  });

  afterEach(function() {
    d3.selectAll("svg.board").remove();
  });

  it("should return correct width", function() {
    var size = $Board.getSize(this.$board);

    expect(size.width).toBeGreaterThan(Math.floor(400/(13+1)));
    expect(size.width).toBeLessThan(Math.ceil(400/(13+1)));
  });

  it("should return correct height", function() {
    var size = $Board.getSize(this.$board);

    expect(size.height).toBeGreaterThan(Math.floor(400/(13+1)));
    expect(size.height).toBeLessThan(Math.ceil(400/(13+1)));
  });
});

describe("$Board.addStone", function() {
  beforeEach(function() {
    d3.select("body").append("svg:svg")
      .attr("height", "400")
      .attr("width", "400")
      .classed("board", true);

    this.$board = $Board({
      selector: "svg.board",
      size: 13
    });
  });

  afterEach(function() {
    d3.selectAll("svg.board").remove();
  });

  it("should place a stone of the right color", function() {
    $Board.addStone(this.$board, 1, 1, Board.types.BLACK);

    var $stone = this.$board.elem.select(".stones .stone");
    expect($stone.classed(Board.types.BLACK)).toBe(true);
  });

  it("should put a stone at the right place", function() {
    $Board.addStone(this.$board, 1, 2, Board.types.BLACK);

    var $stone = this.$board.elem.select(".stones .stone");
    var transform = d3.transform($stone.attr("transform"));

    expect(transform.translate[0]).toBeGreaterThan(Math.floor(400/(13+1)));
    expect(transform.translate[0]).toBeLessThan(Math.ceil(400/(13+1)));

    expect(transform.translate[1]).toBeGreaterThan(Math.floor(2*400/(13+1)));
    expect(transform.translate[1]).toBeLessThan(Math.ceil(2*400/(13+1)));
  });
});
