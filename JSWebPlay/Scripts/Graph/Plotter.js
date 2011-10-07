function Point(x, y) {
    this.x = x;
    this.y = y;
};

function Bounds(width, height) {
    this.width = width;
    this.height = height;
};

function Plotter() {
};

Plotter.prototype.createCanvas = function (origin, bounds) {
    this.origin = origin;
    this.bounds = bounds;
    this.canvas = $("<canvas/>")
                    .css({ display: "block",
                        "background-color": "white",
                        position: "relative",
                        left: origin.x, top: origin.y,
                        width: bounds.width, height: bounds.height
                    })
                    .appendTo("section#plotSection");

    var el = this.canvas[0];
    el.clientWidth = el.width = bounds.width;
    el.clientHeight = el.height = bounds.height;
    this.ctx = this.canvas[0].getContext("2d");
    //Move the device coordinate orgin in the center
    this.ctx.translate(bounds.width / 2, bounds.height / 2);
};

//Given world coordinates, set a transformation function.
//We can't use the inherent canvas transforms because they
//affect the line width.
//
//Once set, use the Plotter instances worldToDevice function

Plotter.prototype.setWorldCoordinates = function (x0, x1, y0, y1) {
    this.x0 = x0;
    this.x1 = x1;
    this.y0 = y0;
    this.y1 = y1;
    
    this.worldToDevice = function (worldPoint) {
        var dx0 = -this.bounds.width / 2;
        var dx1 = this.bounds.width / 2;
        var dy0 = -this.bounds.height / 2;
        var dy1 = this.bounds.height / 2;

        return new Point(
            dx0 + (dx1 - dx0) * (worldPoint.x - x0) / (x1 - x0),
            dy0 + (dy1 - dy0) * (worldPoint.y - y0) / (y1 - y0)
        );
    };
};


Plotter.prototype.drawLine = function(from, to) {
    var dFrom = this.worldToDevice(from);
    var dTo = this.worldToDevice(to);

    var ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(dFrom.x, dFrom.y);
    ctx.lineTo(dTo.x, dTo.y);
    ctx.stroke();
};

Plotter.prototype.drawAxes = function (xMajorTickInterval, xMinorTickInterval, yMajorTickInterval, yMinorTickInterval) {

    //x-axis
    this.drawLine(new Point(this.x0, 0), new Point(this.x1, 0));

    var xMajorTickHeight = (this.x1 - this.x0) / 20;
    var xMinorTickHeight = xMajorTickHeight / 2;
    this.drawXAxisTicks(xMajorTickInterval, xMajorTickHeight);
    this.drawXAxisTicks(xMinorTickInterval, xMinorTickHeight);

    //    var x = 0;
    //    while ((x < Math.abs(this.x0)) || (x < Math.abs(this.x0))) {
    //        //draw a vertical tick mark at +/- x
    //        this.drawLine(new Point(x, -tickHeight / 2), new Point(x, tickHeight / 2));
    //        this.drawLine(new Point(-x, -tickHeight / 2), new Point(-x, tickHeight / 2));
    //        x += xMajorTickInterval;
    //    }

    this.drawLine(new Point(0, this.y0), new Point(0, this.y1));
};

Plotter.prototype.drawXAxisTicks = function(tickInterval, tickHeight) {
    var x = 0;
    while ((x < Math.abs(this.x0)) || (x < Math.abs(this.x0))) {
        //draw a vertical tick mark at +/- x
        this.drawLine(new Point(x, -tickHeight / 2), new Point(x, tickHeight / 2));
        this.drawLine(new Point(-x, -tickHeight / 2), new Point(-x, tickHeight / 2));
        x += tickInterval;
    }
};
