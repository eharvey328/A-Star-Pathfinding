var paused = true;
var stepsAllowed = 0;

var cols = 30;
var rows = 30;
var w, h;
var cells = [];
var current;
var stack = [];
var pathfinder;
var bfspathfinder;
var maze = false;
var isDone = false;
var count = 1;
var canvas_density = 20;
var r = 48;
var g = 79;
var b = 255;
var mode = 0;
var cellSize = 30;
var startCell = 0;
var endCell = 399;

var startX = 0;
var startY = 0;
var endX = 29
var endY = 29

var resetCount = 1;

var alg = "astar"

function runPause() {
	mode = 1;
	alg = document.getElementById("radioGroup").selected;
	initWalls();
	pauseUnpause(!paused);
}

function genMaze() {
	mode = 0;
	resetCount--;
	pauseUnpause(!paused);
}

function resetMaze() {
	resetCount = 1;
	reset();
}

function pauseUnpause(pause) {
	paused = pause;
}

function step() {
	if(isDone) {
		mode = 1;
	}
	pauseUnpause(true);
	stepsAllowed = 1;
}

function getCoordValues(sx, sy, ex, ey) {
	startX = sx;
	startY = sy;
	endX = ex;
	endY = ey;
	initWalls();
}

function getCellValues(sc, ec) {
	startCell = sc;
	endCell = ec;
	setPath(startCell, endCell);
}

function getSliderValues(size, density, cell) {
	cols = size;
	canvas_density = density;
	cellSize = cell;
	resetMaze();
	reset();
	getCoordValues(startX, startY, cols-1, cols-1);
}

function setAlg(algorithm) {
	alg = algorithm;
}

function checkStatus() {
	r = 48;
	g = 79;
	b = 255;
	var MazeToggle = document.getElementById("maze-toggle").classList.contains('iron-selected');
	if (MazeToggle)	{
		mode = 0;
		isDone = false;
		count = 1;
		
		startCell = document.getElementById('startCell').value;
		endCell = document.getElementById('endCell').value;
		alg = document.getElementById("radioGroup").selected;

		if(resetCount > 0) {
			initMaze(cellSize, startCell, endCell);
		} else {
			initPathfinder(startCell, endCell);
		}
		maze = true;
	}
	else {
		rows = cols;
		startX = document.getElementById('startX').value;
		startY = document.getElementById('startY').value;
		endX = document.getElementById('endX').value;
		endY = document.getElementById('endY').value;

		alg = document.getElementById("radioGroup").selected;

		generateMatrix(rows, cols);
		maze = false;
	}
}

function reset() {
	checkStatus();
	var button = document.getElementById("runbtn");
	button.active = false;
	button.textContent = 'Run';
	pauseUnpause(true);
}

function setup() {
	var canv = createCanvas(601, 601);
	canv.parent('canvas-holder');
	checkStatus();
}

function draw() {
	if (maze) pathfindMaze(mode, startCell, endCell);
	else pathfindWalls();
}