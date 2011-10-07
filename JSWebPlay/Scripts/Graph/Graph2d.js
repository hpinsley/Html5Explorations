$(function () {
    //Graph.welcome();

    var plotter = new Plotter();

    var height = $("#plotSection").height();
    var bounds = new Bounds(height, height);
    var origin = new Point(0, 0);

    plotter.createCanvas(origin, bounds);
    //plotter.drawLine(new Point(-3, 0), new Point(3, 0));
    var x0 = -6.28;
    var x1 = 6.28;
    var y0 = -1.5;
    var y1 = 1.5;
    var xMajorTickInterval = 1;
    var xMinorTickInterval = 0.2;
    var yMajorTickInterval = 0.5;
    var yMinorTickInterval = 0.1;

    plotter.setWorldCoordinates(x0, x1, y0, y1);
    plotter.drawAxes(xMajorTickInterval, xMinorTickInterval,
                     yMajorTickInterval, yMinorTickInterval);
});


