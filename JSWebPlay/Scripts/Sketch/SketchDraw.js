var SketchDraw = (function () {
    var my = {};

    my.BasicShapes = { Square: 1, Triangle: 2, Oval: 3 };

    my.ClearCanvas = function (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    my.drawShapes = function (shape, shapeSize, shapeCount, ctx) {

        var draw = getDrawFunc(shape, shapeSize);

        var width = ctx.canvas.width;
        var height = ctx.canvas.height;

        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";

        //var strokeStyleFunc = getRandomStrokeStyle;
        var strokeStyleFunc = getFadingStrokeStyle;

        var angleDelta = Math.PI * 2 / shapeCount;
        for (var i = 0; i < shapeCount; ++i) {
            ctx.strokeStyle = strokeStyleFunc(i+1, shapeCount);
            ctx.rotate(angleDelta);
            draw(ctx);
        }
        ctx.restore();
    };

    //private
    function getDrawFunc(shape, shapeSize) {
        switch (shape) {
            case my.BasicShapes.Square:
                return getSquareFunc(shapeSize);
            case my.BasicShapes.Triangle:
                return getTriangleFunc(shapeSize);
            case my.BasicShapes.Oval:
                return getOvalFunc(shapeSize);
            default:
                throw "Inavlid shape selection: " + shape;
        }
    }

    function getRandomStrokeStyle() {
        var r = Math.floor(Math.random() * 256)
        var g = Math.floor(Math.random() * 256)
        var b = Math.floor(Math.random() * 256)

        var rgb = "rgb(" + r + "," + g + "," + b + ")";
        return rgb;
    }

    function getFadingStrokeStyle(iteration, totalIterations) {
        var pctComplete = iteration / totalIterations;
        var v = Math.floor(pctComplete * 256);
        var color = 255 - v;

        var r = color;
        var g = color;
        var b = color;

        var rgb = "rgb(" + r + "," + g + "," + b + ")";
        return rgb;
    }

    //private
    var getTriangleFunc = function (size) {
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

    //private
    var getSquareFunc = function (size) {

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

    //private
    var getOvalFunc = function (size) {

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


    return my;
} ());