function AStar(start, end) {
    this.lastCheckedNode = start;
    this.openSet = [];
    this.openSet.push(start);
    this.closedSet = [];
    this.start = start;
    this.end = end;

    this.visualDist = function(a, b) {
        return dist(a.i, a.j, b.i, b.j);
    }

    // An educated guess of how far it is between two points
    this.heuristic = function(a, b) {
        var d;
        if (allowDiagonals) {
            d = dist(a.i, a.j, b.i, b.j);
        } else {
            d = abs(a.i - b.i) + abs(a.j - b.j);
        }
        return d;
    }

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

                    if (!this.allowDiagonals) {
                        if (this.openSet[i].g == this.openSet[winner].g && this.openSet[i].vh < this.openSet[winner].vh) {
                            winner = i;
                        }
                    }
                }
            }
            
            var current = this.openSet[winner];
            this.lastCheckedNode = current;

            // Did I finish?
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

            // Check all the neighbors
            var neighbors = current.getNeighbors();

            for (var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];

                // Valid next spot?
                if (!this.closedSet.includes(neighbor) && !neighbor.wall) {
                    // Is this a better path than before?
                    var tempG = current.g + this.heuristic(neighbor, current);

                    // Is this a better path than before?
                    if (!this.openSet.includes(neighbor)) {
                        this.openSet.push(neighbor);
                    } else if (tempG >= neighbor.g) {
                        // No, it's not a better path
                        continue;
                    }

                    neighbor.g = tempG;
                    neighbor.h = this.heuristic(neighbor, end);
                    if (!allowDiagonals) {
                        neighbor.vh = this.visualDist(neighbor, end);
                    }
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }

            }
            return 0;
            
        } else {
            r = 255;
            g = 23;
            b = 68;
            console.log('no solution');
            return -1;
        }
    }
}

function stepSearch() {
    if (!paused || stepsAllowed > 0) {
        var result = pathfinder.step();
        stepsAllowed--;

        switch (result) {
            case -1:
            //status = "No Solution";
            pauseUnpause(true);
            break;

            case 1:
            //status = "Goal Reached!";
            pauseUnpause(true);
            break;

            case 0:
            //status = "Still Searching"
            break;
        }
    }
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
    stroke(r,g,b);
    strokeWeight(w/4);
    beginShape();
    for (var i = 0; i < path.length; i++) {
      vertex(path[i].i * w + w / 2, path[i].j*w + w / 2);
  }
  endShape();
}