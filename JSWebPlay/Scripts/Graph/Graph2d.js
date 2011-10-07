$(function () {
    //Graph.welcome();

    var plotter = new Plotter();

    var height = $("#plotSection").height();
    var bounds = new Bounds(height, height);
    var origin = new Point(0, 0);

    plotter.createCanvas(origin, bounds);
    //plotter.drawLine(new Point(-3, 0), new Point(3, 0));
    var x0 = -3.14;
    var x1 = 3.14;
    var y0 = -3.14;
    var y1 = 3.14;
    plotter.setWorldCoordinates(x0, x1, y0, y1);
    plotter.drawLine(new Point(0, -3), new Point(0, 3));
    plotter.drawLine(new Point(-3, 0), new Point(3, 0));
});


