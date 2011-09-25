function Wall(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.color = 'green';
}

Wall.prototype.strokeWidth = 1;

Wall.prototype.draw = function (ctx) {
    ctx.lineWidth = this.strokeWidth;
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
};

Wall.prototype.makeIntoDoor = function () {
    return new Door(this.p1, this.p2);
};

