var	cols = 50;
var	rows = 50;
var grid = new Array(cols);
var w, h;
var paused = true;
var pathfinder;
var stepsAllowed = 0;
var r = 0;
var g = 0;
var b = 255;
var canvas_density = 30;
//var canvas_size = 50;


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


function initialize(rows, cols) {
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

function setup() {
	var canv = createCanvas(600, 600);
	canv.parent('canvas-holder');
	initialize(cols, rows);
}

function stepSearch() {
	if (!paused || stepsAllowed > 0) {
		var result = pathfinder.step();
		console.log(pathfinder);
		stepsAllowed--;

		switch (result) {
			case -1:
			status = "No Solution";
			r = 255;
			g = 0;
			b = 0;
			pauseUnpause(true);
			break;
			case 1:
			status = "Goal Reached!";
			r = 0;
			g = 255;
			b = 0;
			pauseUnpause(true);
			break;
			case 0:
			status = "Still Searching"
			break;
		}
	}
}

function drawWalls() {
	for (var i = 0; i < cols; i++) {
		for(var j = 0; j < rows; j++) {
			if (grid[i][j].wall) {
				grid[i][j].show(color(255));
			}
		}
	}
}

// this function is looping continuously on the page
function draw() {
	stepSearch();
	background(50);
	drawWalls();

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
    stroke(r, g, b);
    strokeWeight(w/2);
    beginShape();
    for (var i = 0; i < path.length; i++) {
    	vertex(path[i].i * w + w / 2, path[i].j*h + h / 2);
    }
    endShape();
}