function Spot(i, j, w, h, grid) {
	// Spot position in grid
	this.grid = grid;

	this.i = i;
	this.j = j;

	this.f = 0; // function value of g and h
	this.g = 0; // "g score" (total cost at pos)
	this.h = 0; // heuristic (heading the right dir)
	this.vh = 0; //visual heuristic for prioritising path options

	this.neighbors = undefined;
	this.neighboringWalls = undefined;
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

	this.getNeighbors = function() {
		if (!this.neighbors) {
			this.populateNeighbors();
		}
		return this.neighbors;
	}

	this.getNeighboringWalls = function(grid) {
		if (!this.neighboringWalls) {
			this.populateNeighbors();
		}

		return this.neighboringWalls;
	}

    //maybe should be static properties?
    var LURDMoves = [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1]
    ];
    var DiagonalMoves = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1]
    ];
    //references to the LURDMoves entries that would block the diagonal
    //if they are both walls and canPassThroughCorners = false
    var DiagonalBlockers = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0]
    ];

    //return node or null if request is out of bounds
    this.getNode = function(i, j) {
    	if (i < 0 || i >= this.grid.length || j < 0 || j >= this.grid[0].length) {
    		return null;
    	}
    	return this.grid[i][j];
    }

    //populate neighbor move and neighbor wall arrays
    this.populateNeighbors = function() {
    	this.neighbors = [];
    	this.neighboringWalls = [];

        //Add Left/Up/Right/Down Moves
        for (var i = 0; i < 4; i++) {
        	var node = this.getNode(this.i + LURDMoves[i][0], this.j + LURDMoves[i][1]);
        	if (node != null) {
        		if (!node.wall) {
        			this.neighbors.push(node);
        		} else {
        			this.neighboringWalls.push(node);
        		}
        	}
        }

        //Add Diagonals
        for (var i = 0; i < 4; i++) {
        	var gridX = this.i + DiagonalMoves[i][0];
        	var gridY = this.j + DiagonalMoves[i][1];

        	var node = this.getNode(gridX, gridY);

        	if (node != null) {
        		if (allowDiagonals && !node.wall) {
        			if (!canPassThroughCorners) {
                        //Check if blocked by surrounding walls
                        var border1 = DiagonalBlockers[i][0];
                        var border2 = DiagonalBlockers[i][1];
                        //no need to protect against OOB as diagonal move
                        //check ensures that blocker refs must be valid
                        var blocker1 = this.grid[this.i + LURDMoves[border1][0]]
                        [this.j + LURDMoves[border1][1]];
                        var blocker2 = this.grid[this.i + LURDMoves[border2][0]]
                        [this.j + LURDMoves[border2][1]];


                        if (!blocker1.wall || !blocker2.wall) {
                            //one or both are open so we can move past
                            this.neighbors.push(node);
                        }
                    }else {
                    	this.neighbors.push(node);
                    }
                }
                if (node.wall) {
                	this.neighboringWalls.push(node);
                }
            }
        }
    }
}