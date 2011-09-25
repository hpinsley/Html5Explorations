function BoundingRectangle(left, top, width, height) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.right = left + width;
    this.bottom = top + height;
};

BoundingRectangle.prototype.toString = function () {
    return "(" + this.left + "," + this.top + ")-(" + this.right + "," + this.bottom + ")";
};

BoundingRectangle.prototype.center = function () {
    return this.left + this.width / 2;
};