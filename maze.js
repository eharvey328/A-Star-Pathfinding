var cols, rows;
var w = 30;
var grid = [];
var current;
var stack = [];
var pathfinder;
var stepsAllowed = 0;
var paused = true;

function runPause() {
  pauseUnpause(!paused);
}

function pauseUnpause(pause) {
  paused = pause;
}

function step() {
  pauseUnpause(true);
  stepsAllowed = 1;
}

function restart() {
  initialize(cols, rows);
  pauseUnpause(true);
}

function initMaze() {
  cols = floor(width/w);
  rows = floor(height/w);

  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var cell = new Cell(i, j, grid);
      grid.push(cell);
    }
  }
  current = grid[0];
}

function setup() {
  var canv = createCanvas(601, 601);
  canv.parent('canvas-holder');
  initMaze();
}

function removeWalls(a, b) {
  var x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  var y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

function drawGrid() {
  for (var i = 0; i < grid.length; i++) {
    grid[i].show(color(255,255,255,15));
  }
}

function drawMaze() {
  drawGrid();

  current.visited = true;
  current.highlight();

  var next = current.checkNeighbors();
  if (next) {
    next.visited = true;
    stack.push(current);
    removeWalls(current, next);
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  }

  if(stack.length > 0) return false;
  else return true;
}

function index(i, j) {
  if (i < 0 || j < 0 || i > cols-1 || j > rows-1) {
    return -1;
  }
  return i + j * cols;
}

function initSolve() {
  for (var i = 0; i < cols; i++) {
    for(var j = 0; j < rows; j++) {
      grid[index(i, j)].addNeighbors(grid);
    }
  }

  var start = grid[0];
  var end = grid[399];

  pathfinder = new AStar(start, end);
}

function stepSearch() {
  if (!paused || stepsAllowed > 0) {
    var result = pathfinder.step();
    stepsAllowed--;

    switch (result) {
      case -1:
      status = "No Solution";
      pauseUnpause(true);
      break;

      case 1:
      status = "Goal Reached!";
      pauseUnpause(true);
      break;

      case 0:
      status = "Still Searching"
      break;
    }
  }
}

var done = false;
var count = 1;

function draw() {
  background(20);
  
  if(!done) {
    done = drawMaze();
  }

  if(done) {

    if(count > 0) {
      initSolve();
      count--;
    }

    drawGrid();
    stepSearch();

    for (var i = 0; i < pathfinder.closedSet.length; i++) {
      pathfinder.closedSet[i].show(color(255, 0, 0, 50));
    }

    for (var i = 0; i < pathfinder.openSet.length; i++) {
      var node = pathfinder.openSet[i];
      node.show(color(0, 255, 0, 50));
    }

    fill(0);
    var path = calcPath(pathfinder.lastCheckedNode);
    drawPath(path);
    // for (var i = 0; i < path.length; i++) {
    //   path[i].show(color(0,0,255,200));
    // }
  }
}

function calcPath(endNode) {
    // Find the path by working backwards
    path = [];
    var temp = endNode;
    path.push(temp);
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }
    return path
  }

  function drawPath(path) {
    // Drawing path as continuous line
    noFill();
    stroke(0,0,255);
    strokeWeight(w/4);
    beginShape();
    for (var i = 0; i < path.length; i++) {
      vertex(path[i].i * w + w / 2, path[i].j*w + w / 2);
    }
    endShape();
}
