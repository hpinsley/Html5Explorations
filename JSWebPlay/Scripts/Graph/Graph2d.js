﻿$(function () {
    //Graph.welcome();

    var plotter = new Plotter();

    var height = $("#plotSection").height();
    var bounds = new Bounds(height, height);
    var origin = new Point(0, 0);

    plotter.createCanvas(origin, bounds);

    var x0 = -1 * Math.PI;
    var x1 = 1 * Math.PI;
    var xMajorTickInterval = 1;
    var xMinorTickInterval = 0.1;

    var y0 = -1.2;
    var y1 = 1.2;
    var yMajorTickInterval = 1.0;
    var yMinorTickInterval = 0.2;

    plotter.setWorldCoordinates(x0, x1, y0, y1);

    var n = 2000;
    var funcX = Math.sin;

    plotter.eraseCanvas();
    plotter.drawAxes(xMajorTickInterval, xMinorTickInterval, yMajorTickInterval, yMinorTickInterval);
    plotter.plotFunction(x0, x1, n, funcX);
});


