function Cell(maze, row, col) {
    this.maze = maze;
    this.row = row;
    this.col = col;
    this.height = maze.cellHeight;
    this.width = maze.cellWidth;
    this.left = this.col * this.width;
    this.top = this.row * this.height;
    this.visited = false;
    
    var topCorner = new Point(col * this.width, row * this.height);
    this.sides = {
        n: new Door(topCorner, new Point(topCorner.x + this.width, topCorner.y)),
        e: new Door(new Point(topCorner.x + this.width, topCorner.y), new Point(topCorner.x + this.width, topCorner.y + this.height)),
        s: new Door(new Point(topCorner.x, topCorner.y + this.height), new Point(topCorner.x + this.width, topCorner.y + this.height)),
        w: new Door(new Point(topCorner.x, topCorner.y), new Point(topCorner.x, topCorner.y + this.height))
    };

    this.midPoint = new Point(topCorner.x + this.width / 2, topCorner.y + this.height / 2);

    if (row == 0) {
        this.sides.n = this.sides.n.makeIntoWall();
    }
    if (col == 0) {
        this.sides.w = this.sides.w.makeIntoWall();
    }
    if (row == maze.rows - 1) {
        this.sides.s = this.sides.s.makeIntoWall();
    }
    if (col == maze.cols - 1) {
        this.sides.e = this.sides.e.makeIntoWall();
    }

}

Cell.prototype.toString = function () {
    return "Cell[" + this.row + "," + this.col + "]";
};

Cell.prototype.isInList = function (list) {
    for (var i = 0; i < list.length; ++i) {
        if (this === list[i])
            return true;
    }
    return false;
};

//clientWidth and clientHeight are passed as device pixels.
Cell.prototype.isInside = function (x, y) {
    var result = ((x >= this.left) &&
        (x < (this.left + this.width)) &&
            (y >= this.top) &&
                (y <= (this.top + this.height))
    );
    return result;
};

Cell.prototype.getWallOrDoor = function (doorDirection) {
    switch (doorDirection) {
        case direction.n:
            return this.sides.n;
        case direction.s:
            return this.sides.s;
        case direction.e:
            return this.sides.e;
        case direction.w:
            return this.sides.w;
    }
    return direction.n; //just to avoid compile warning; shouldn't get here
};

Cell.prototype.draw = function (ctx) {
    //Send the draw message to either the doors or the walls as appropriate for the cell
    this.sides.n.draw(ctx);
    this.sides.e.draw(ctx);
    this.sides.s.draw(ctx);
    this.sides.w.draw(ctx);
};

Cell.prototype.breakWall = function (doorDirection) {
    var wall = this.getWallOrDoor(doorDirection);
    var door = wall.makeIntoDoor();
    switch (doorDirection) {
        case direction.n:
            this.sides.n = door;
        case direction.s:
            this.sides.s = door;
        case direction.e:
            this.sides.e = door;
        case direction.w:
            this.sides.w = door;
    }
    door.openDoor();
};

Cell.prototype.getNeighbors = function () {
    var list = [];
    var r1 = Math.max(0, this.row - 1);
    var r2 = Math.min(this.maze.rows - 1, this.row + 1);
    var c1 = Math.max(0, this.col - 1);
    var c2 = Math.min(this.maze.cols - 1, this.col + 1);
    var neighbor;
    var r, c;
    for (r = r1; r <= r2; ++r) {
        c = this.col;
        neighbor = this.maze.cells[r][c];
        if (neighbor != this) {
            list[list.length] = neighbor;
        }
    }
    for (c = c1; c <= c2; ++c) {
        r = this.row;
        neighbor = this.maze.cells[r][c];
        if (neighbor != this) {
            list[list.length] = neighbor;
        }
    }
    return list;
};

Cell.prototype.getUnvisitedNeighbors = function () {
    var list = [];
    var allNeighbors = this.getNeighbors();
    for (var i = 0; i < allNeighbors.length; ++i) {
        var neighbor = allNeighbors[i];
        if (!neighbor.visited)
            list[list.length] = neighbor;
    }
    return list;
};

Cell.prototype.getReachableNeighbors = function () {
    var list = [];
    var allNeighbors = this.getNeighbors();
    for (var i = 0; i < allNeighbors.length; ++i) {
        var neighbor = allNeighbors[i];
        if (this.canVisit(neighbor))
            list[list.length] = neighbor;
    }
    return list;
};

Cell.prototype.canVisit = function (cell) {
    if (!this.isANeighbor(cell))
        return false;
    var directionToNeighbor = this.getDirectionToNeighbor(cell);
    var door = this.getWallOrDoor(directionToNeighbor);
    return door.isOpen;
};

Cell.prototype.isANeighbor = function (other) {
    var allNeighbors = this.getNeighbors();
    for (var i = 0; i < allNeighbors.length; ++i) {
        var neighbor = allNeighbors[i];
        if (other === neighbor)
            return true;
    }
    return false;
};

Cell.prototype.hasUnvisitedNeighbors = function () {
    var list = this.getUnvisitedNeighbors();
    return list.length > 0;
};
Cell.prototype.hasReachableNeighbors = function () {
    var list = this.getReachableNeighbors();
    return list.length > 0;
};

Cell.prototype.getRandomUnvisitedNeighbor = function() {
    var list = this.getUnvisitedNeighbors();
    var index = Math.floor(Math.random() * list.length);
    return list[index];
};

Cell.prototype.getDirectionToNeighbor = function (neighbor) {
    var r1, c1, r2, c2;
    r1 = this.row;
    c1 = this.col;
    r2 = neighbor.row;
    c2 = neighbor.col;

    if (r1 == r2) {
        //East or west
        return (c2 > c1) ? direction.e : direction.w;
    }
    else if (c1 == c2) {
        //North o South
        return (r2 < r1) ? direction.n : direction.s;
    }
    throw "Invalid neighbor detected.";
};
