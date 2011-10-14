function Matrix(rows, cols) {
    this.rows = rows;
    this.cols = cols;

    this.values = [];       //array of the rows

    var i = 1;  //position over the cells argument 

    for (var r = 0; r < this.rows; ++r) {
        this.values[r] = [];    //column array
        for (var c = 0; c < this.cols; ++c) {
            ++i;
            if (i < arguments.length) {
                this.values[r][c] = arguments[i];
            }
            else {
                this.values[r][c] = 0;
            }
        }
    }

    return this;
}

Matrix.I2 = new Matrix(2, 2, 1, 0, 0, 1);
Matrix.I3 = new Matrix(3, 3, 1, 0, 0, 0, 1, 0, 0, 0, 1);

Matrix.prototype.shape = function() {
    return this.rows + " by " + this.cols;
};

Matrix.equals = function (m1, m2) {
    if (typeof m1 !== typeof m2)
        return false;
    if (m1.rows !== m2.rows || m1.cols !== m2.cols)
        return false;

    for (var r = 0; r < m1.rows; ++r) {
        for (var c = 0; c < m1.cols; ++c) {
            if (m1.values[r][c] !== m2.values[r][c]) {
                return false;
            }
        }
    }

    return true;
};

Matrix.multiply = function (m1, m2) {
    if (typeof m1 !== typeof m2)
        return false;
    if (m1.cols !== m2.rows)
        throw "Cannot multiply a " + m1.shape() + " matrix and a " + m2.shape() + " matrix.";

    var product = new Matrix(m1.rows, m2.cols);

    for (var r = 0; r < m1.rows; ++r) {
        for (var c = 0; c < m1.cols; ++c) {
            if (m1.values[r][c] !== m2.values[r][c]) {
                return false;
            }
        }
    }

    return true;
};
