direction = { n: "n", s: "s", e: "e", w: "w" };  //enum

function MazeGame(rows, cols, boardWidth, boardHeight) {
    this.rows = rows;
    this.cols = cols;
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;
    

    this.cellWidth = boardWidth / cols;
    this.cellHeight = boardHeight / rows;

    //Create the cells but don't draw them
    this.cells = [];    //rows
    for (var r = 0; r < this.rows; ++r) {
        this.cells[r] = []; //row c -- array of cells
        for (var c = 0; c < this.cols; ++c) {
            this.cells[r][c] = new Cell(this, r, c);
        }
    }

    this.startCell = this.cells[this.rows - 1][0];
    this.endCell = this.cells[0][this.cols - 1];

    this.resetUserPath();
};

MazeGame.prototype.eraseUserPath = function (ctx) {

    ctx.strokeStyle = "black";
    ctx.strokeWidth = 1;

    var oldComposite = ctx.globalCompositeOperation;
    var oldAlpha = ctx.globalAlpha;
    alert("oldAlpha is " + oldAlpha + " and composite operation is " + oldComposite);
    ctx.globalCompositeOperation = "copy";
    this.connectCellPath(this.userPath, ctx);
    ctx.globalCompositeOperation = oldComposite;

    this.resetUserPath();
};

MazeGame.prototype.resetUserPath = function() {
    this.userPath = [];
    this.userPath.push(this.startCell);

};

MazeGame.prototype.registerClick = function (x, y, ctx) {
    //alert("You clicked at " + x + "," + y);
    var clickedCell = this.hitTestCells(x, y);
    if (clickedCell != null) {
        //alert("You clicked on cell " + clickedCell.toString());
        var userPosition = this.userPath[this.userPath.length - 1];
        if (userPosition.canVisit(clickedCell)) {
            if (!clickedCell.isInList(this.userPath)) {
                this.userPath.push(clickedCell);
                ctx.strokeStyle = "green";
                this.connectCellPath(this.userPath, ctx);
            }
        }
    }
};

MazeGame.prototype.hitTestCells = function (x, y) {
    for (var r = 0; r < this.rows; ++r) {
        for (var c = 0; c < this.cols; ++c) {
            var cell = this.cells[r][c];
            if (cell.isInside(x, y))
                return cell;
        }
    }
    return null;
};

MazeGame.prototype.drawCells = function (ctx) {
    for (var r = 0; r < this.rows; ++r) {
        for (var c = 0; c < this.cols; ++c) {
            this.cells[r][c].draw(ctx);
        }
    }
};

MazeGame.prototype.randomRow = function () {
    var n = Math.random() * this.rows;
    return Math.floor(n);
};

MazeGame.prototype.randomCol = function () {
    var n = Math.random() * this.cols;
    return Math.floor(n);
};

MazeGame.prototype.tracePath = function (fromCell, toCell, ctx) {
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(fromCell.midPoint.x, fromCell.midPoint.y);
    ctx.lineTo(toCell.midPoint.x, toCell.midPoint.y);
    //ctx.clip();
    ctx.stroke();
};

MazeGame.prototype.connectCells = function(fromRow, fromCol, toRow, toCol, ctx) {
    var fromCell = this.cells[fromRow][fromCol];
    var toCell = this.cells[toRow][toCol];
    this.tracePath(fromCell, toCell, ctx);
};

MazeGame.prototype.connectCellPath = function(cells, ctx) {
    //cells is an array of cells;

    for (var i = 1; i < cells.length; ++i) {
        var from = cells[i - 1];
        var to = cells[i];
        this.tracePath(from, to, ctx);
    }
};

MazeGame.prototype.openDoorBetweenNeighbors = function (from, to) {
    var neighborDirection = from.getDirectionToNeighbor(to);
    this.openDoor(from.row, from.col, neighborDirection);
};

MazeGame.prototype.openDoor = function (r, c, doorDirection, ctx) {
    var cell1 = this.cells[r][c];
    var door1 = cell1.getWallOrDoor(doorDirection);
    var cell2;
    var door2 = null;

    switch (doorDirection) {
        case direction.n:
            cell2 = this.cells[r - 1][c];
            door2 = cell2.getWallOrDoor(direction.s);
            break;
        case direction.s:
            cell2 = this.cells[r + 1][c];
            door2 = cell2.getWallOrDoor(direction.n);
            break;
        case direction.e:
            cell2 = this.cells[r][c + 1];
            door2 = cell2.getWallOrDoor(direction.w);
            break;
        case direction.w:
            cell2 = this.cells[r][c - 1];
            door2 = cell2.getWallOrDoor(direction.e);
            break;
    }

    door1.openDoor();
    door2.openDoor();

    if (ctx != undefined) {
        door1.draw(ctx);
        door2.draw(ctx);
    }
};

MazeGame.prototype.breakWall = function(r, c, doorDirection) {
    var cell = this.cells[r][c];
    cell.breakWall(doorDirection);
};

MazeGame.prototype.setEntranceAndExit = function () {
    //pick a random cell along the bottom row for the start of the maze
    var entranceCol = this.randomCol();
    var entranceRow = this.rows - 1;
    maze.breakWall(entranceRow, entranceCol, direction.s);
    this.entranceCell = this.cells[entranceRow][entranceCol];

    //pick a random cell along the top row for the exit of the maze
    var exitCol = this.randomCol();
    var exitRow = 0;
    maze.breakWall(exitRow, exitCol, direction.n);
    this.exitCell = this.cells[exitRow][exitCol];
};

MazeGame.prototype.setPathFromEntranceToExit = function () {
    //open doors along a random path from the entranceCell to the exit Cell

    var currentRow = this.rows - 1;
    var pathPointer = this.entranceCell;
    var that = this;

    while (currentRow > 0) {
        //breakthrough from the lower row to the upper
        var breakThroughCol = this.randomCol();
        //alert("Moving from row " + currentRow + " to row " + (currentRow - 1) + " in col " + breakThroughCol);
        var targetCell = this.cells[currentRow][breakThroughCol];
        movePathTo(targetCell);
        //breakthrough in a north direction to the next row
        this.openDoor(currentRow, breakThroughCol, direction.n);
        --currentRow;
        pathPointer = this.cells[currentRow][breakThroughCol];
    }

    //we are now on row 0
    movePathTo(this.exitCell);
    
    //inner helper function
    function movePathTo(target) {
        while (pathPointer != target) {
            var doorDirection = (target.col > pathPointer.col) ? direction.e : direction.w;
            var deltaCol = (target.col > pathPointer.col) ? 1 : -1;
            while (pathPointer.col != target.col) {
                that.openDoor(currentRow, pathPointer.col, doorDirection);
                pathPointer = that.cells[currentRow][pathPointer.col + deltaCol];   //move along path
            }
        }
    }
};

MazeGame.prototype.randomWalk = function () {
    var currentCell = this.cells[this.rows - 1][this.randomCol()];

    var that = this;
    walk(currentCell);

    function walk(curCell) {
        curCell.visited = true;
        while (curCell.hasUnvisitedNeighbors()) {
            var neighbor = curCell.getRandomUnvisitedNeighbor();
            that.openDoorBetweenNeighbors(curCell, neighbor);
            walk(neighbor);
        }
    };
};

MazeGame.prototype.solveMaze = function () {
    var cells = [];


    cells.push(this.startCell);

    var curCell = cells[cells.length - 1];
    if (this.solve(null, curCell, this.endCell, cells)) {
        return cells;
    }
    else {
        throw "No solution";
    }

};

MazeGame.prototype.solve = function (priorCell, currentCell, endCell, cells) {
    if (currentCell == endCell)
        return true;

    var possibleNeighbors = currentCell.getReachableNeighbors();

    for (var i = 0; i < possibleNeighbors.length; ++i) {
        var neighbor = possibleNeighbors[i];
        //Look to see where we can move.  We have to excluse the place from
        //which we came lest we loop forever
        if (neighbor != priorCell) {
            cells.push(neighbor);
            if (this.solve(currentCell, neighbor, endCell, cells))
                return true;
            cells.pop();
        }
    }
    return false;
};



