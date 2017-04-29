function Cell(i, j, grid) {
  this.i = i;
  this.j = j;

  this.f = 0; // function value of g and h
  this.g = 0; // "g score" (total cost at pos)
  this.h = 0; // heuristic (heading the right dir)

  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;

  this.walls = [true, true, true, true];
  this.visited = false;

  function index(i, j) {
    if (i < 0 || j < 0 || i > cols-1 || j > rows-1) {
      return -1;
    }
    return i + j * cols;
  }

  this.addNeighbors = function(grid) {
    var top = grid[index(i, j - 1)];
    var right = grid[index(i + 1, j)];
    var bottom = grid[index(i, j + 1)];
    var left = grid[index(i - 1, j)];

    if (top && !this.walls[0]) {
      this.neighbors.push(top);
    }
    if (right && !this.walls[1]) {
      this.neighbors.push(right);
    }
    if (bottom && !this.walls[2]) {
      this.neighbors.push(bottom);
    }
    if (left && !this.walls[3]) {
      this.neighbors.push(left);
    }    
  }

  this.checkNeighbors = function() {
    var cells = [];

    var top = grid[index(i, j - 1)];
    var right = grid[index(i + 1, j)];
    var bottom = grid[index(i, j + 1)];
    var left = grid[index(i - 1, j)];

    if (top && !top.visited) {
      cells.push(top);
    }
    if (right && !right.visited) {
      cells.push(right);
    }
    if (bottom && !bottom.visited) {
      cells.push(bottom);
    }
    if (left && !left.visited) {
      cells.push(left);
    }

    if (cells.length > 0) {
      var r = floor(random(0, cells.length));
      return cells[r];
    } else {
      return undefined;
    }
  }

  this.highlight = function() {
    var x = this.i * w;
    var y = this.j * w;
    
    noStroke();
    fill(0, 0, 255);
    rect(x, y, w, w);
  }

  this.show = function(color) {
    var x = this.i * w;
    var y = this.j * w;

    stroke(120);

    if (this.walls[0]) {
      line(x, y, x + w, y);
    }
    if (this.walls[1]) {
      line(x + w, y, x + w, y + w);
    }
    if (this.walls[2]) {
      line(x + w, y + w, x, y + w);
    }
    if (this.walls[3]) {
      line(x, y + w, x, y);
    }

    if (this.visited) {
      noStroke();
      fill(color);
      rect(x, y, w, w);
    }
  }
}