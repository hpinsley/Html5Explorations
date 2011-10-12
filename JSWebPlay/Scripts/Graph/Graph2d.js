$(function () {

    var initialDomainWidth = 3;
    var initialRangeWidth = 2;

    $("#eq1").val("sin(x)");
    $("#eq2").val("cos(x)");

    $("#domainSlider").slider({
        min: 0,
        max: 10,
        value: initialDomainWidth,
        slide: domainWidthChange
    });

    $("#rangeSlider").slider({
        min: 0,
        max: 10,
        value: initialRangeWidth,
        slide: rangeWidthChange,
        step: 1
    });

    $("#plotButton").click(plotClick);

    window.g_plotter = new Plotter();

    var h = $("#plotSection").height();
    var w = $("#plotSection").width();
    var height = h * 0.90;
    var width = w * 0.90;
    var bounds = new Bounds(width, height);
    var origin = new Point(w * 0.05, h * 0.05);

    window.g_plotter.createCanvas(origin, bounds);

    setDomainWidth(initialDomainWidth);
    setRangeWidth(initialRangeWidth);
    plotGraphs();


});

function domainWidthChange(target, data) {
    setDomainWidth(data.value);
    plotGraphs();

    var sliderElement = $("#domainSlider");
    //dynamicallAdjustSlider(sliderElement);
};

function rangeWidthChange(target, data) {
    setRangeWidth(data.value);
    plotGraphs();
};

function dynamicallAdjustSlider(sliderElement) {

    var val = sliderElement.slider("option", "value");
    max = 2 * val;
    var step = max / 10.0;
    sliderElement.slider("option", "max", max);
    sliderElement.slider("option", "step", step);
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
    var plotFunctions = [];

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

    var n = 2000;

    g_plotter.eraseCanvas();
    g_plotter.drawAxes(xMajorTickInterval, xMinorTickInterval, yMajorTickInterval, yMinorTickInterval);
    
    $.each(plotFunctions, function (i, fX) {
        g_plotter.plotFunction(x0, x1, n, fX);        
    });
    
    

};

