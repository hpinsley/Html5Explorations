$(function () {

    $("#domainSlider").slider({
        min: 0,
        max: 50,
        slide: domainWidthChange
    });

    $("#rangeSlider").slider({
        min: 0,
        max: 100,
        slide: rangeWidthChange
    });

    g_plotter = new Plotter();

    var h = $("#plotSection").height();
    var w = $("#plotSection").width();
    var height = h * 0.90;
    var width = w * 0.90;
    var bounds = new Bounds(width, height);
    var origin = new Point(w * 0.05, h * 0.05);

    g_plotter.createCanvas(origin, bounds);

    $("#plotButton").click(plotClick);

});

function domainWidthChange(target, data) {
    setDomainWidth(data.value);
    plotGraphs();
};

function rangeWidthChange(target, data) {
    setRangeWidth(data.value);
    plotGraphs();
};

function setDomainWidth(width) {
    $("#lblXMin").html(-width.toString());
    $("#lblXMax").html(width.toString());
};

function setRangeWidth(width) {
    $("#lblYMin").html(-width.toString());
    $("#lblYMax").html(width.toString());
};

function plotClick() {
    plotGraphs();
};

function plotGraphs() {
    var expression = $("#eq1").val();

    if (!expression)
        return;

    var funcX = g_plotter.makeFunctionOfX(expression);

    var x0 = parseFloat($("#lblXMin").html());
    var x1 = parseFloat($("#lblXMax").html());
    var xMajorTickInterval = 1;
    var xMinorTickInterval = 0.1;

    var y0 = parseFloat($("#lblYMin").html());
    var y1 = parseFloat($("#lblYMax").html());
    var yMajorTickInterval = 1.0;
    var yMinorTickInterval = 0.2;

    g_plotter.setWorldCoordinates(x0, x1, y0, y1);

    var n = 2000;

    g_plotter.eraseCanvas();
    g_plotter.drawAxes(xMajorTickInterval, xMinorTickInterval, yMajorTickInterval, yMinorTickInterval);
    g_plotter.plotFunction(x0, x1, n, funcX);

};

