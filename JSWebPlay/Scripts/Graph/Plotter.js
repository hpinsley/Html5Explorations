function Point(x, y) {
    this.x = x;
    this.y = y;
};

function Bounds(width, height) {
    this.width = width;
    this.height = height;
}

function Plotter() {
};

Plotter.prototype.createCanvas = function (origin, bounds) {
    this.origin = origin;
    this.bounds = bounds;
    this.canvas = $("<canvas/>")
                    .css({ display: "block",
                        "background-color": "blue",
                        position: "relative",
                        left: origin.x, top: origin.y,
                        width: bounds.width, height: bounds.height
                    })
                    .appendTo("section#plotSection");

    var el = this.canvas[0];
    el.clientWidth = el.width = bounds.width;
    el.clientHeight = el.height = bounds.height;
    this.ctx = this.canvas[0].getContext("2d");

};


Plotter.prototype.drawLine = function (from, to) {
    var ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}