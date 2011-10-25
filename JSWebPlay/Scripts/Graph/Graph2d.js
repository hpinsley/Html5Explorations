$(function () {

    window.g_plotter = new Plotter();
    window.g_movieMaker = new MovieMaker();

    window.g_default2dPoints = 1000;
    window.g_default3dPoints = 150;

    $("#xAngleRotation").val("-330");
    $("#yAngleRotation").val("-330");
    $("#zAngleRotation").val("-330");
    $("#numPoints").val(g_default2dPoints);

    $("#rotationAngles").hide();

    $("#plotButton").click(plot2dClick);
    $("#plot3dButton").click(plot3dClick);

    $("#switchTo2dBtn").click(switchTo2DMode);
    $("#switchTo3dBtn").click(switchTo3DMode);

    var initialDomainWidth = 3;
    var initialRangeWidth = 2;
    var initialDomainStep = 0.1;
    var initialRangeStep = 0.1;

    $("#eq1").val("sin(x)");
    $("#eq2").val("cos(x)");

    $("#eq1_3d").val("sin(x)*cos(x*y)");

    $("#domainSlider").slider({
        min: 0,
        max: 100,
        step: initialDomainStep,
        value: initialDomainWidth,
        slide: domainWidthChange
    });

    $("#rangeSlider").slider({
        min: 0,
        max: 100,
        step: initialRangeStep,
        value: initialRangeWidth,
        slide: rangeWidthChange
    });



    var h = $("#plotSection").height();
    var w = $("#plotSection").width();
    var height = h * 0.90;
    var width = w * 0.90;
    var bounds = new Bounds(width, height);
    var origin = new Point(w * 0.05, h * 0.05);

    window.g_plotter.createCanvas(origin, bounds);

    setDomainWidth(initialDomainWidth);
    setRangeWidth(initialRangeWidth);

    $("#captureImageButton").click(getDataUrlClicked);
    $("#imageCloseBtn").click(function () {
        $("#imageCaptureSection").hide();
    });

    $("#playMovieButton").click(function () {
        var ctx = g_plotter.getContext();
        var frameDelay = parseInt($("#frameRate").val());
        g_movieMaker.playMovie(ctx, frameDelay);
    });

    $("#pushFrameButton").click(pushFrame);
    $("#animateXBtn").click(animateX);
    $("#animateYBtn").click(animateY);
    $("#animateZBtn").click(animateZ);

    switchTo2DMode();
    plot2dGraphs();
});

function switchTo2DMode() {
        $(".d3Control").hide();
        $(".d2Control").show();

        $("#numPoints").val(g_default2dPoints);
        g_plotter.setTwoDMode();
    };

function switchTo3DMode() {
        $(".d2Control").hide();
        $(".d3Control").show();

        $("#eq2_3d").focus();
        $("#numPoints").val(g_default3dPoints);
        g_plotter.setThreeDMode();
    };

function pushFrame() {
    var ctx = g_plotter.getContext();
    g_movieMaker.pushFrame(ctx);
    $("#frameCount").text(g_movieMaker.getFrameCount());
};

function animateAlongAxis(rotationAngleId) {
    var frames = parseInt($("#animationFrameCount").val());
    statusMessage("Animating " + frames + " frames.");
    var start = parseFloat($("#" + rotationAngleId).val());
    var end = -1 * start;
    var inc = (end - start) / (frames - 1);
    var x;
    var frameNo = 0;

    var startRGB = [parseInt($("#redStart").val()),
        parseInt($("#greenStart").val()),
        parseInt($("#blueStart").val())];
    
    var endRGB = [parseInt($("#redEnd").val()),
        parseInt($("#greenEnd").val()),
        parseInt($("#blueEnd").val())];
    
    var rgbInc = [(endRGB[0] - startRGB[0]) / (frames - 1),
        (endRGB[1] - startRGB[1]) / (frames - 1),
        (endRGB[2] - startRGB[2]) / (frames - 1)];
    
    function captureFrame() {
        x = start + frameNo * inc;
        //alert("capturing frame " + frameNo + " with x = " + x);
        $("#" + rotationAngleId).val(x);
        var r = startRGB[0] + frameNo * rgbInc[0];
        var g = startRGB[1] + frameNo * rgbInc[1];
        var b = startRGB[2] + frameNo * rgbInc[2];
        var strokeStyle = "rgb(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")";
        plot3dGraphs(strokeStyle);
        pushFrame();

        ++frameNo;
        if (frameNo < frames) {
            setTimeout(captureFrame, 100);
        }
        else {
            statusMessage("Captured " + frames + " frames.");
        }
    };
    captureFrame();
};

function animateX() {
    animateAlongAxis("xAngleRotation");
};
function animateY() {
    animateAlongAxis("yAngleRotation");
};
function animateZ() {
    animateAlongAxis("zAngleRotation");
};

function getDataUrlClicked() {
    var canvas = g_plotter.canvas[0];
    var dataUrl = canvas.toDataURL();
    //alert(dataUrl);

    var imageElement = $("<img />");
    imageElement[0].src = dataUrl;
    $("#imageDiv").empty().append(imageElement);
    $("#imageCaptureSection").show();
};

function domainWidthChange(target, data) {
    setDomainWidth(data.value);
    g_plotter.isThreeDMode() ? plot3dGraphs() : plot2dGraphs();
};

function rangeWidthChange(target, data) {
    setRangeWidth(data.value);
    g_plotter.isThreeDMode() ? plot3dGraphs() : plot2dGraphs();
};

function setDomainWidth(width) {
    var positiveOnly = $("#xPositiveOnly")[0].checked;
    
    if (positiveOnly) {
        $("#lblXMin").html((-Math.ceil(0.20 * width)).toString());  //leave a % on the negative side to show y axis ticks
        $("#lblXMax").html((2 * width).toString());
    }
    else {
        $("#lblXMin").html(-width.toString());
        $("#lblXMax").html(width.toString());
    }
};

function setRangeWidth(width) {
    $("#lblYMin").html(-width.toString());
    $("#lblYMax").html(width.toString());
};

function plot2dClick() {
    plot2dGraphs();
};
function plot3dClick() {
    plot3dGraphs();
};

function plot2dGraphs() {
    var plotFunctions = [];
    var plottingColors = ["black", "blue"];

    var expressionIds = ["eq1", "eq2"];
    $.each(expressionIds, function(i, id) {
        var expression = $("#" + id).val();
        if (expression) {
            var funcX = g_plotter.makeFunctionOfX(expression);
            plotFunctions.push(funcX);
        }
    });

    var x0 = parseFloat($("#lblXMin").html());
    var x1 = parseFloat($("#lblXMax").html());
    var xMajorTickInterval = 1;
    var xMinorTickInterval = 0.1;

    var y0 = parseFloat($("#lblYMin").html());
    var y1 = parseFloat($("#lblYMax").html());
    var yMajorTickInterval = 1.0;
    var yMinorTickInterval = 0.2;

    g_plotter.setWorldCoordinates(x0, x1, y0, y1);

    var n = parseInt($("#numPoints").val());

    g_plotter.eraseCanvas();
    g_plotter.drawAxes(xMajorTickInterval, xMinorTickInterval, yMajorTickInterval, yMinorTickInterval);

    $.each(plotFunctions, function (i, fX) {
        var strokeStyle = plottingColors[i % plottingColors.length];
        g_plotter.plotFunction(x0, x1, n, fX, strokeStyle);
    });



};

function plot3dGraphs(sstyle) {
    var plotFunctions = [];
    var plottingColors = ["black", "blue"];

    var expressionIds = ["eq1_3d", "eq2_3d"];
    $.each(expressionIds, function (i, id) {
        var expression = $("#" + id).val();
        if (expression) {
            var funcXY = g_plotter.makeFunctionOfXY(expression);
            plotFunctions.push(funcXY);
        }
    });

    var x0 = parseFloat($("#lblXMin").html());
    var x1 = parseFloat($("#lblXMax").html());

    var y0 = parseFloat($("#lblYMin").html());
    var y1 = parseFloat($("#lblYMax").html());

    g_plotter.setWorldCoordinates(x0, x1, y0, y1);

    var n = parseInt($("#numPoints").val());

    g_plotter.eraseCanvas();

    var xAngle = parseFloat($("#xAngleRotation").val());
    var yAngle = parseFloat($("#yAngleRotation").val());
    var zAngle = parseFloat($("#zAngleRotation").val());
    $.each(plotFunctions, function (i, fXY) {
        var strokeStyle = sstyle || plottingColors[i % plottingColors.length];
        g_plotter.plot3dFunction(x0, x1, n, y0, y1, n, fXY, strokeStyle, xAngle, yAngle, zAngle);
    });

};

function statusMessage(msg) {
    $("#statusBarMsg").text(msg);
}

function clearStatusMessage() {
    statusMessage("");
}