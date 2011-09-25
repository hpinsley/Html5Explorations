$(function () {
    sizeCanvas();
    drawStandardRect();
});

function drawStandardRect() {
    var ctx = getContext();

    ctx.save();
    //ctx.scale(0.5, 0.5);
    
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = "red";
    ctx.fillRect(-100, -100, 200, 200);
    ctx.restore();

};

function sizeCanvas() {
    var canvas = $("canvas")[0];
    canvas.width = 1000;
    canvas.height = 1000;
};

function getContext() {
    var canvas = $("canvas")[0];
    var ctx = canvas.getContext("2d");
    return ctx;
}