$(function () {


    $("#CtlDraw").click(function () {

        var shapeCount = parseInt($("#ctlCount").val());
        var shapeSize = parseInt($("#ctlSize").val());

        var ctx = getContext();
        ctx.canvas.width = 500;
        ctx.canvas.height = 500;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        drawShapes(shapeCount, shapeSize, ctx);

    });
});

function getContext() {
    var canvas = $("canvas")[0];
    var ctx = canvas.getContext("2d");
    return ctx;
};

function drawShapes(shapeCount, shapeSize, ctx) {

    var width = ctx.canvas.width;
    var height = ctx.canvas.height;

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";

    var draw;
    if ($("input#ctlTriangle")[0].checked) {
        draw = getTriangleFunc(shapeSize);
    }
    else if ($("input#ctlSquare")[0].checked) {
        draw = getSquareFunc(shapeSize);
    }
    else if ($("input#ctlOval")[0].checked) {
        draw = getOvalFunc(shapeSize);
    }

   
    var angleDelta = Math.PI * 2 / shapeCount;
    for (var i = 0; i < shapeCount; ++i) {
        ctx.strokeStyle = getRandomStrokeStyle();
        ctx.rotate(angleDelta);
        draw(ctx);
    }
    ctx.restore();
};

function getRandomStrokeStyle() {
    return "rgb(40,40,40)";
}

function getTriangleFunc(size) {

    //Draw an equilateral triangle with sides (side) centered at (0,0)
    var draw = function (ctx) {
        var height = Math.round(size * Math.sqrt(3.0) / 2.0);
        var bottom = height / 2;
        var top = -height / 2;
        var left = -size / 2;
        var right = size / 2;

        ctx.beginPath();
        ctx.moveTo(0, top);
        ctx.lineTo(right, bottom);
        ctx.lineTo(left, bottom);
        ctx.lineTo(0, top);
        ctx.stroke();
    };
    return draw;
};

function getSquareFunc(size) {

    //Draw a squre centered at the origin

    var draw = function (ctx) {
        var half = size / 2;

        ctx.beginPath();
        ctx.moveTo(-half, -half);
        ctx.lineTo(half, -half);
        ctx.lineTo(half, half);
        ctx.lineTo(-half, half);
        ctx.lineTo(-half, -half);
        ctx.stroke();
    };
    return draw;
};

function getOvalFunc(size) {

    //Draw a squre centered at the origin
    var draw = function (ctx) {
        ctx.save();
        var radius = size / 2;
        ctx.scale(1, 0.75);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.restore();
    };
    return draw;
};

