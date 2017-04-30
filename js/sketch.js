var paused = true;
var stepsAllowed = 0;

var cols = 50;
var rows = 50;
var w, h;
var cells = [];
var current;
var stack = [];
var pathfinder;

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
	initWalls(cols, rows);
	//initMaze();
	pauseUnpause(true);
}

function setup() {
	var canv = createCanvas(601, 601);
	canv.parent('canvas-holder');
	initWalls(cols, rows);
	//initMaze();
}

function draw() {
	pathfindWalls();
	//pathfindMaze();
}