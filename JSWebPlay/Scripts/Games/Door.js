function Door(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.isOpen = false;
}

Door.prototype.strokeWidth = 1;

Door.prototype.openDoor = function () {
    this.isOpen = true;
};

Door.prototype.makeIntoWall = function () {
    return new Wall(this.p1, this.p2);
};

Door.prototype.draw = function (ctx) {
    var color = (this.isOpen ? 'white' : 'black');
    ctx.lineWidth = this.strokeWidth;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
};
