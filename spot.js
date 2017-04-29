function Spot(i, j, w, h, grid) {
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
			//ellipse(this.i * w + w/2, this.j * h + h/2, w/2, h/2);
			rect(this.i * w, this.j * h, w, h);
		} else if (color) {
			fill(color);
			noStroke();
			rect(this.i * w, this.j * h, w, h);
		}
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