var paused = true;
var stepsAllowed = 0;

var cols = 30;
var rows = 30;
var w, h;
var cells = [];
var current;
var stack = [];
var pathfinder;
var maze = false;
var isDone = false;
var count = 1;
var canvas_density = 20;
var r = 48;
var g = 79;
var b = 255;

var startX = 0;
var startY = 0;
var endX = 29
var endY = 29

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

function getCoordValues(sx, sy, ex, ey) {
	startX = sx;
	startY = sy;
	endX = ex;
	endY = ey;
	initWalls();
}

function getSliderValues(size, density) {
	cols = size;
	canvas_density = density;
	reset();
	getCoordValues(startX, startY, cols-1, cols-1);
}

function checkStatus() {
	r = 48;
	g = 79;
	b = 255;
	var MazeToggle = document.getElementById("maze-toggle").classList.contains('iron-selected');
	if (MazeToggle)	{
		isDone = false;
		count = 1;
		initMaze();
		maze = true;
	}
	else {
		rows = cols;
		startX = document.getElementById('startX').value;
		startY = document.getElementById('startY').value;
		endX = document.getElementById('endX').value;
		endY = document.getElementById('endY').value;

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
	if (maze) pathfindMaze();
	else pathfindWalls();
}