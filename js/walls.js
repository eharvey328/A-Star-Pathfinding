var r = 0;
var g = 0;
var b = 255;
var canvas_density = 30;
//var canvas_size = 50;

function initWalls(rows, cols) {
	r = 0;
	g = 0;
	b = 255;
	//canvas_size = document.getElementById('canvas-size').value;
	canvas_density = document.getElementById('canvas-density').value;

	//cols = canvas_size;
 	//rows = canvas_size

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

	for (var i = 0; i < cols; i++) {
		for(var j = 0; j < rows; j++) {
			grid[i][j].addNeighbors(grid);
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