var canvas_density = 30;
var canPassThroughCorners = false;
var allowDiagonals = true;

function generateMatrix(rows, cols) {
	grid = new Array(cols);

	w = width / cols;
	h = height / rows;

	//create 2d array
	for (var i = 0; i < cols; i++) {
		grid[i] = new Array(rows);
	}

	for (var i = 0; i < cols; i++) {
		for(var j = 0; j < rows; j++) {
			grid[i][j] = new Spot(i, j, w, h, grid);
		}
	}

	initWalls();
}

function initWalls() {
	//find path from top left to bot right
	var start = grid[startX][startY];
	var end = grid[endX][endY];

	start.wall = false;
	end.wall = false;
	end.end = true;

	if(alg == "astar") {
		pathfinder = new AStar(start, end);
	} else {
		pathfinder = new dijkstra(start, end);
	}
}

function displayWalls() {
	for (var i = 0; i < cols; i++) {
		for(var j = 0; j < rows; j++) {
			if (grid[i][j].wall) {
				grid[i][j].show(color(255));
			}
		}
	}
}

// this function is looping continuously on the page
function pathfindWalls() {
	stepSearch();
	background(color(48,48,48));
	displayWalls();

	pathfinder.start.show(color(0, 230, 118, 150));
	pathfinder.end.show(color(255,234,0, 200));

	for (var i = 0; i < pathfinder.closedSet.length; i++) {
		pathfinder.closedSet[i].show(color(255, 23, 68, 50));
	}

	for (var i = 0; i < pathfinder.openSet.length; i++) {
		var node = pathfinder.openSet[i];
		node.show(color(0, 230, 118, 50));
	}

	fill(0);
	var path = calcPath(pathfinder.lastCheckedNode);
	drawPath(path);
}