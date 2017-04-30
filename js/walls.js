var r = 0;
var g = 0;
var b = 255;
var canvas_density = 30;

var canPassThroughCorners = false;
var allowDiagonals = true;
//var canvas_size = 50;

function initWalls(rows, cols) {

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

	//find path from top left to bot right
	var start = grid[0][0];
	var end = grid[cols-1][rows-1];

	start.wall = false;
	end.wall = false;

	pathfinder = new AStar(start, end);
}

function generateWalls() {
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
	background(50);
	generateWalls();

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