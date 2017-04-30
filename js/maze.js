function initMaze() {
  w = 30;
  cols = floor(width/w);
  rows = floor(height/w);

  cells = [];
  stack = [];
  current = null;

  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var cell = new Cell(i, j, cells);
      cells.push(cell);
    }
  }
  current = cells[0];
}

function drawGrid() {
  for (var i = 0; i < cells.length; i++) {
    cells[i].show(color(255,255,255,15));
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

function initPathfinder() {
  for (var i = 0; i < cols; i++) {
    for(var j = 0; j < rows; j++) {
      cells[index(i, j)].addNeighbors(cells);
    }
  }

  var start = cells[0];
  var end = cells[399];

  pathfinder = new AStar(start, end);
}

function pathfindMaze() {
  
  background(20);
  
  if(!isDone) {
    isDone = generateMaze();
  }

  if(isDone) {

    if(count > 0) {
      initPathfinder();
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
  }
}