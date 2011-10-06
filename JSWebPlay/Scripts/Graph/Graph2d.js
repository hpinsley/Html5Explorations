$(function () {
    //Graph.welcome();

    var plotter = new Plotter();

    var height = $("#plotSection").height();
    var bounds = new Bounds(height, height);
    var origin = new Point(0, 0);

    plotter.createCanvas(origin, bounds);
    plotter.drawLine(new Point(0, 0), new Point(100, 100));
    plotter.drawLine(new Point(0, 50), new Point(100, 150));

});


