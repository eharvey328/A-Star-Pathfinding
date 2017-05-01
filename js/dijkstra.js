function dijkstra(start, end) {
	this.lastCheckedNode = start;
	this.openSet = [];
	this.openSet.push(start);
	this.closedSet = [];
	this.start = start;
	this.end = end;

    this.removeFromArray = function(arr, elt) {
        var index = arr.indexOf(elt);
        if (index > -1) {
            arr.splice(index, 1);
        }
    }

	this.step = function() {
		if (this.openSet.length > 0) {
			// Best next option
			var winner = 0;
			for (var i = 1; i < this.openSet.length; i++) {
				if (this.openSet[i].f < this.openSet[winner].f) {
					winner = i;
				}

                //if we have a tie according to the standard heuristic
                if (this.openSet[i].f == this.openSet[winner].f) {
                    //Prefer to explore options with longer known paths (closer to goal)
                    if (this.openSet[i].g > this.openSet[winner].g) {
                    	winner = i;
                    }
                }
            }

            var current = this.openSet[winner];
            this.lastCheckedNode = current;

            // Best option moves from openSet to closedSet
            this.removeFromArray(this.openSet, current);
            this.closedSet.push(current);

            if (current === this.end) {
            	r = 118;
            	g = 255;
            	b = 3;
            	console.log("DONE!");
            	return 1;
            }

            // Best option moves from openSet to closedSet
            this.removeFromArray(this.openSet, current);
            this.closedSet.push(current);

            var neighbors = current.getNeighbors();

            for(var i = 0; i < neighbors.length; i++) {
            	var neighbor = neighbors[i];
            	if (!this.closedSet.includes(neighbor) && !neighbor.wall) {
                    // Is this a better path than before?
                    var tempG = current.g;

                    // Is this a better path than before?
                    if (!this.openSet.includes(neighbor)) {
                    	this.openSet.push(neighbor);
                    } else if (tempG >= neighbor.g) {
                        // No, it's not a better path
                        continue;
                    }

                    neighbor.g = tempG;                  
                    neighbor.f = neighbor.g;
                    neighbor.previous = current;
                }
            }

            return 0;
        } else {
        	return -1;
        }
    }
}