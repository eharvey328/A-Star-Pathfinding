var paused = true;
var stepsAllowed = 0;

var cols = 50;
var rows = 50;
var w, h;
var cells = [];
var current;
var stack = [];
var pathfinder;
var maze = false;
var isDone = false;
var count = 1;
var r = 0;
var g = 0;
var b = 255;

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

function checkStatus() {
	r = 0;
	g = 0;
	b = 255;
	var MazeToggle = document.getElementById("MazeToggle").parentNode.classList.contains('btn-success');
	if (MazeToggle)	{
		isDone = false;
		count = 1;
		initMaze();
		maze = true;
	}
	else {
		cols = document.getElementById('canvas-size').value;
		rows = cols;
		initWalls(cols, rows);
		maze = false;
	}
}

function restart() {
	checkStatus();
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