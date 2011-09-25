var maze;

$(function () {
    $("#CtlDrawMaze").click(drawCells);
    $("#CtlSolveMaze").click(showSolution);
    //$("#maze").click(mazeClick);
    $("#maze").bind("mousemove", null, mazeClick);
    $("#CtlErasePath").click(eraseUserPath);
    
    resizeMaze();
});

//I have found that resizing the maze to the actual client dimension work better.
//Also the click events use these coordinates

function resizeMaze() {
    var jq = $("#maze");
    jq[0].width = jq[0].clientWidth;
    jq[0].height = jq[0].clientHeight;
};

function mazeClick(info) {
    if (maze === undefined)
        return;
    var x = info.offsetX;
    var y = info.offsetY;
    var ctx = mazeContext();
    maze.registerClick(x, y, ctx);
};

function drawCells() {
    var size = parseInt($("#ctlSize").val());
    var rows = size;
    var cols = size;
    var jq = $("#maze");
    var boardWidth = jq[0].width;
    var boardHeight = jq[0].height;
    maze = new MazeGame(rows, cols, boardWidth, boardHeight);
    //alert('Maze is ' + maze.boardWidth + " x " + maze.boardHeight);
    var ctx = mazeContext();
    ctx.clearRect(0, 0, boardWidth, boardHeight);

    maze.randomWalk();
    maze.drawCells(ctx);

};

function showSolution() {
    if (maze === undefined)
        return;
    
    var cells = maze.solveMaze();

    var ctx = mazeContext();
    ctx.strokeStyle = "red";
    ctx.strokeWidth = 1;
    maze.connectCellPath(cells, ctx);
};

function eraseUserPath() {
    if (maze === undefined)
        return;

    var ctx = mazeContext();
    maze.eraseUserPath(ctx);
};

function mazeContext() {
    var maze = $("#maze")[0];
    var ctx = maze.getContext("2d");
    return ctx;    
}