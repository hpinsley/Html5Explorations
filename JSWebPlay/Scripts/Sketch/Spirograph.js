$(function () {

    var ctx = getContext();
    ctx.canvas.width = 500;
    ctx.canvas.height = 500;

    $("#CtlDraw").click(function () {

        var shapeCount = parseInt($("#ctlCount").val());
        var shapeSize = parseInt($("#ctlSize").val());
        var shape = null;

        if ($("input#ctlTriangle")[0].checked) {
            shape = SketchDraw.BasicShapes.Triangle;
        }
        else if ($("input#ctlSquare")[0].checked) {
            shape = SketchDraw.BasicShapes.Square;
        }
        else if ($("input#ctlOval")[0].checked) {
            shape = SketchDraw.BasicShapes.Oval;
        }

        SketchDraw.ClearCanvas(ctx);
        SketchDraw.drawShapes(shape, shapeSize, shapeCount, ctx);
    });
});

function getContext() {
    var canvas = $("canvas")[0];
    var ctx = canvas.getContext("2d");
    return ctx;
};