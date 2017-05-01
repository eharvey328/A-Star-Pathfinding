var nCols;
var nRows;

function initMaze(cSize, start, end) {
  nCols = cols;
  nRows = rows

  w = cSize;
  nCols = floor(width/w);
  nRows = floor(height/w);

  cells = [];
  stack = [];

  current = null;

  for (var j = 0; j < nRows; j++) {
    for (var i = 0; i < nCols; i++) {
      var cell = new Cell(i, j, cells);
      cells.push(cell);
    }
  }

  setPath(start, end);
  current = cells[0];
}

function setPath(start, end) {
  cells[start].start = true;
  cells[end].end = true;
}

function drawGrid(start, end) {
  cells[start].show(color(0,230,118,200));
  cells[end].show(color(255,234,0,200));

  for (var i = 0; i < cells.length; i++) {
    cells[i].show(color(0,0,0,16));
  }
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

function generateMaze() {
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
  if (i < 0 || j < 0 || i > nCols-1 || j > nRows-1) {
    return -1;
  }
  return i + j * nCols;
}

function initPathfinder(start, end) {
  for (var i = 0; i < nCols; i++) {
    for(var j = 0; j < nRows; j++) {
      cells[index(i, j)].addNeighbors(cells);
    }
  }

  var start = cells[start];
  var end = cells[end];

  pathfinder = new AStar(start, end);
}

function pathfindMaze(mode, start, end) {
  background(color(48,48,48));
  drawGrid(start, end);

  if(mode == 0 && !paused) {
    isDone = generateMaze();
  }

  if(isDone && mode == 0) {
    paused = true;
  }

  if(mode == 1) {
    if(count > 0) {
      initPathfinder(start, end);
      count--;
    }

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
  }
}