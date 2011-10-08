function Point(x, y) {
    this.x = x;
    this.y = y;
};

function Bounds(width, height) {
    this.width = width;
    this.height = height;
};

function Plotter() {
    this.xLabelSize = 8;
    this.yLabelSize = 8;
    this.fontName = "Arial";
    this.labelOffsetFactor = 1.5;
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

Plotter.prototype.eraseCanvas = function () {
    this.ctx.clearRect(-this.bounds.width / 2, -this.bounds.height / 2, this.bounds.width, this.bounds.height);
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
            -1 * (dy0 + (dy1 - dy0) * (worldPoint.y - y0) / (y1 - y0))
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

    var xMajorTickHeight = (this.y1 - this.y0) / 20;
    var xMinorTickHeight = xMajorTickHeight / 2;
    var yMajorTickWidth = (this.x1 - this.x0) / 20;
    var yMinorTickWidth = yMajorTickWidth / 2;

    //x-axis
    if (this.x1 > this.x0) {
        this.drawLine(new Point(this.x0, 0), new Point(this.x1, 0));
        this.drawXAxisTicks(xMajorTickInterval, xMajorTickHeight, true);
        this.drawXAxisTicks(xMinorTickInterval, xMinorTickHeight, false);
    }

    //y-axis
    if (this.y1 > this.y0) {
        this.drawLine(new Point(0, this.y0), new Point(0, this.y1));
        this.drawYAxisTicks(yMajorTickInterval, yMajorTickWidth, true);
        this.drawYAxisTicks(yMinorTickInterval, yMinorTickWidth, false);
    }
};

Plotter.prototype.drawXAxisTicks = function (tickInterval, tickHeight, labelTicks) {
    var xLabelSize = this.xLabelSize;
    var x = 0;
    while ((x < Math.abs(this.x0)) || (x < Math.abs(this.x1))) {
        //draw a vertical tick mark at +/- x
        this.drawLine(new Point(x, -tickHeight / 2), new Point(x, tickHeight / 2));
        this.drawLine(new Point(-x, -tickHeight / 2), new Point(-x, tickHeight / 2));
        
        //label the tick to the bottom

        if (labelTicks) {
            if (x !== 0) {
                this.writeString(-x.toString(), new Point(-x, -this.labelOffsetFactor * tickHeight), xLabelSize);
                this.writeString(x.toString(), new Point(x, -this.labelOffsetFactor * tickHeight), xLabelSize);
            }
        }
        x += tickInterval;
    }
};

Plotter.prototype.drawYAxisTicks = function (tickInterval, tickWidth, labelTicks) {
    var yLabelSize = this.yLabelSize;

    var y = 0;
    while ((y < Math.abs(this.y0)) || (y < Math.abs(this.y1))) {
        //draw a horizontal tick mark at +/- y
        this.drawLine(new Point(-tickWidth / 2, y), new Point(tickWidth / 2, y));
        this.drawLine(new Point(-tickWidth / 2, -y), new Point(tickWidth / 2, -y));
        //label the tick to the left

        if (labelTicks) {
            if (y !== 0) {
                this.writeString(-y.toString(), new Point(-this.labelOffsetFactor * tickWidth, -y), yLabelSize);
                this.writeString(y.toString(), new Point(-this.labelOffsetFactor * tickWidth, y), yLabelSize);
            }
        }

        y += tickInterval;
    }
};

Plotter.prototype.writeString = function (str, location, fontSize) {
    var dLocation = this.worldToDevice(location);
    this.ctx.save();
    this.ctx.font = this.getFontName(fontSize);
    this.ctx.fillText(str, dLocation.x, dLocation.y);
    this.ctx.restore();
};

Plotter.prototype.getFontName = function (fontSize) {
    return "" + Math.round(fontSize) + "pt " + this.fontName;
};

Plotter.prototype.plotFunction = function (x0, x1, n, funcOfX) {

    if (x1 <= x0 || n <= 0) {
        return;
    }

    var xInc = (x1 - x0) / n;
    var x = x0;
    var y;
    var worldPoint;

    this.ctx.beginPath();

    do {
        y = funcOfX(x);
        worldPoint = this.worldToDevice(new Point(x, y));
        if (x == x0) {
            this.ctx.moveTo(worldPoint.x, worldPoint.y);
        }
        else {
            this.ctx.lineTo(worldPoint.x, worldPoint.y);
        }

        x += xInc;
    } while (x <= x1);

    this.ctx.stroke();
};
