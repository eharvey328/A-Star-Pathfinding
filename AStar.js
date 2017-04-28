var cols = 20;
var rows = 20;
var grid = new Array(cols);

var openSet = []; // all nodes to be checked
var closedSet = []; // all nodes checked
var start;
var end;
var w, h;
var path = [];
var drawPath = false;
var canvas_size = 50;
var canvas_density = 30;


function Spot(i, j) {
	// Spot position in grid
	this.i = i;
	this.j = j;

	this.f = 0; // function value of g and h
	this.g = 0; // "g score" (total cost at pos)
	this.h = 0; // heuristic (heading the right dir)
	this.neighbors = []; // all spots touching this spot
	this.previous = undefined;
	this.wall = false;

	if (random(1) < (canvas_density/100)) {
		this.wall = true;
	}

	// display the spot on the grid
	this.show = function(color) {
		if (this.wall) {
			fill(0);
			noStroke();
			ellipse(this.i * w + w/2, this.j * h + h/2, w/2, h/2);
		}
		//rect(this.i * w, this.j * h, w-1, h-1); // size is based on the grid
	}

	this.addNeighbors = function(grid) {
		if (this.i < cols - 1) {
			this.neighbors.push(grid[this.i+1][this.j]);
		}
		if (this.i > 0) {
			this.neighbors.push(grid[this.i-1][this.j]);
		}
		if (this.j < rows-1) {
			this.neighbors.push(grid[this.i][this.j+1]);
		}
		if (this.j > 0) {
			this.neighbors.push(grid[this.i][this.j-1]);
		}
		if (i > 0 && j > 0) {
			this.neighbors.push(grid[this.i-1][this.j-1]);
		}
		if (i < cols - 1 && j > 0) {
			this.neighbors.push(grid[this.i+1][this.j-1]);
		}
		if (i > 0 && j < rows - 1) {
			this.neighbors.push(grid[this.i-1][this.j+1]);
		}
		if (i < cols-1 && j < rows-1) {
			this.neighbors.push(grid[this.i+1][this.j+1]);
		}
	}
}

function setup() {
	var canv = createCanvas(400,400);
	canv.parent('canvas-holder');
	resetSketch();
}

function resetSketch() {
	
	canvas_size = document.getElementById('canvas-size').value;
	canvas_density = document.getElementById('canvas-density').value;

	console.log(canvas_size);
	cols = canvas_size;
	rows = canvas_size;
	grid = new Array(cols);

	openSet = []; // all nodes to be checked
	closedSet = []; // all nodes checked
	start;
	end;
	w, h;
	path = [];

	// calculate the number of spots horiz and vert
	w = width / cols;
	h = height / rows;

	//create 2d array
	for (var i = 0; i < cols; i++) {
		grid[i] = new Array(rows);
	}

	for (var i = 0; i < cols; i++) {
		for(var j = 0; j < rows; j++) {
			grid[i][j] = new Spot(i, j);
		}
	}

	for (var i = 0; i < cols; i++) {
		for(var j = 0; j < rows; j++) {
			grid[i][j].addNeighbors(grid);
		}
	}

	//find path from top left to bot right
	start = grid[0][0];
	end = grid[cols-1][rows-1];

	openSet.push(start);
	start.wall = false;
	end.wall = false;
	drawPath = false;
	loop();
}

function drawToggle() {
	drawPath = true;
}


// this function is looping continuously on the page
function draw() {


	//if (drawPath){ 
	if (openSet.length > 0) {
		var lowestPos = 0;
		for (var i = 0; i < openSet.length; i++) {
			if (openSet[i].f < openSet[lowestPos].f) {
				lowestPos = i;
			}
		}

		var current = openSet[lowestPos];
		if (current == end) {
			console.log("Finished");
			noLoop();
		}

		removeFromArray(openSet, current);
		closedSet.push(current);

		var neighbors = current.neighbors;
		for (var i = 0; i < neighbors.length; i++) {
			var neighbor = neighbors[i];

			if (!closedSet.includes(neighbor) && !neighbor.wall) {
				var tempG = current.g + 1;

				var newPath = false;
				if (openSet.includes(neighbor)) {
					// already in openSet
					// update the value if lower
					if(tempG < neighbor.g) {
						neighbor.g = tempG;
						newPath = true;
					}
				} else {
					// add to openSet
					neighbor.g = tempG;
					newPath = true;
					openSet.push(neighbor);
				}

				if (newPath) {
					neighbor.h = heuristic(neighbor, end);
					neighbor.f = neighbor.g + neighbor.h;
					neighbor.previous = current;
				}


			}	
		}
	} else {
		console.log('no solution');
		noLoop();
		return;
	}

	background(255);

	for (var i = 0; i < cols; i++) {
		for(var j = 0; j < rows; j++) {
			grid[i][j].show(color(255));
		}
	}

	for (var i = 0; i < closedSet.length; i++) {
		closedSet[i].show(color(255,0,0));
	}	

	for (var i = 0; i < openSet.length; i++) {
		openSet[i].show(color(0,255,0));
	}

	// find the path
	path = [];
	var temp = current;
	path.push(temp);
	while (temp.previous) {
		path.push(temp.previous);
		temp = temp.previous;
	}

	for (var i = 0; i < path.length; i++) {
		//path[i].show(color(0,0,255));
	}
	noFill();
	stroke(255, 0, 200);
	strokeWeight(w/2);
	beginShape();
	for (var i = 0; i < path.length; i++) {
		vertex(path[i].i * w + w / 2, path[i].j*h + h / 2);
	}

	endShape();
//	}
}

// this can be optimized later
function removeFromArray(arr, element) {
	for (var i = arr.length-1; i>=0; i--) {
		if (arr[i] == element) {
			arr.splice(i, 1);
		}
	}
}

// checks how far away a point is from another using manhattan dist formula
function heuristic(a, b) {
	var d = dist(a.i, a.j, b.i, b.j);
	return d;
}