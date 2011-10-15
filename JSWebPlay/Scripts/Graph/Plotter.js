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

    this.setTwoDMode();
};

Plotter.modes = { TwoDim: 1, ThreeDim: 2 };

Plotter.prototype.setTwoDMode = function () { this.mode = Plotter.modes.TwoDim; };
Plotter.prototype.setThreeDMode = function () { this.mode = Plotter.modes.ThreeDim; };
Plotter.prototype.isThreeDMode = function () { return this.mode === Plotter.modes.ThreeDim; };

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
    el.width = bounds.width;
    el.height = bounds.height;
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


Plotter.prototype.drawLine = function (from, to) {
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

Plotter.prototype.plotFunction = function (x0, x1, n, funcOfX, strokeStyle) {

    if (x1 <= x0 || n <= 0) {
        return;
    }

    var xInc = (x1 - x0) / n;
    var x = x0;
    var y;
    var devPoint;
    var plottedPoints = 0;
    var hugeYVal = 100000;

    this.ctx.save();
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();

    do {
        y = funcOfX(x);

        //If you attempt to graph to out of range, for some
        //reason, it draws nothing.
        if (Math.abs(y) < hugeYVal) {

            ++plottedPoints;

            devPoint = this.worldToDevice(new Point(x, y));
            if (plottedPoints === 1) {
                this.ctx.moveTo(devPoint.x, devPoint.y);
            }
            else {
                this.ctx.lineTo(devPoint.x, devPoint.y);
            }
        }

        x += xInc;
    } while (x <= x1);

    this.ctx.stroke();
    this.ctx.restore();
};

Plotter.prototype.makeFunctionOfX = function (expression) {
    var exp = this.makeMathFunctionSubstitutions(expression);
    //Need to surround in parens to make it a function "expression"
    return eval("(function (x) { return " + exp + "; });");
};

Plotter.prototype.makeFunctionOfXY = function (expression) {
    var exp = this.makeMathFunctionSubstitutions(expression);
    //Need to surround in parens to make it a function "expression"
    return eval("(function (x,y) { return " + exp + "; });");
};

Plotter.prototype.makeMathFunctionSubstitutions = function(expression) {
    var exp = expression.toLowerCase();

    exp = exp.replace(/pi/g, "Math.PI");

    exp = exp.replace(/cos\(/g, "Math.cos(");
    exp = exp.replace(/sin\(/g, "Math.sin(");
    exp = exp.replace(/tan\(/g, "Math.tan(");
    exp = exp.replace(/sqrt\(/g, "Math.sqrt(");
    exp = exp.replace(/log\(/g, "Math.log(");
    exp = exp.replace(/exp\(/g, "Math.exp(");
    exp = exp.replace(/pow\(/g, "Math.pow(");
    exp = exp.replace(/random\(/g, "Math.random(");
    exp = exp.replace(/abs\(/g, "Math.abs(");
    exp = exp.replace(/round\(/g, "Math.round(");
    exp = exp.replace(/ceil\(/g, "Math.ceil(");
    exp = exp.replace(/floor\(/g, "Math.floor(");

    //Trick to handle asin, acos, and atan.  The sub for sin
    //cos and tan has already kicked in.

    exp = exp.replace(/aMath\./g, "Math.a");

    return exp;    
};

Plotter.prototype.plot3dFunction = function (x0, x1, nx,
                                             y0, y1, ny,
                                             funcOfXY, strokeStyle,
                                             xAngle, yAngle, zAngle) {

    if (x1 <= x0 || nx <= 0) {
        return;
    }
    if (y1 <= y0 || ny <= 0) {
        return;
    }

    //create a rotational matrix

    var rotationalMatrix = Matrix.xyzRotationalMatrix(xAngle, yAngle, zAngle);

    var xInc = (x1 - x0) / nx;
    var yInc = (y1 - y0) / ny;
    var z;
    var devPoint;
    var plottedPoints = 0;

    this.ctx.save();
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();

    for (var x = x0; x <= x1; x += xInc) {
        for (var y = y0; y <= y1; y += yInc) {
            z = funcOfXY(x, y);

            //rotate the point x,y,z
            var pointMatrix = new Matrix(3, 1, x, y, z);
            var rotatedPoint = Matrix.multiply(rotationalMatrix, pointMatrix);
            //rotated point matrix is a 3x1 matrix
            var rx = rotatedPoint.values[0][0];
            var ry = rotatedPoint.values[1][0];
            var rz = rotatedPoint.values[2][0];

            var mappedPoint = new Point(rx, ry);    //drop the z component for projection
            
            devPoint = this.worldToDevice(mappedPoint);
            if (plottedPoints === 1) {
                this.ctx.moveTo(devPoint.x, devPoint.y);
            }
            else {
                this.ctx.lineTo(devPoint.x, devPoint.y);
            }
        }
    }
    this.ctx.stroke();
    this.ctx.restore();
};
