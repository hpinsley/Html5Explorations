function Stack() {
    this.stack = [];
    this.count = 0;
};

Stack.prototype.push = function (obj) {
    this.stack[this.count++] = obj;
};

Stack.prototype.pop = function () {
    if (this.count > 0)
        return this.stack[--this.count];

    return null;
};

