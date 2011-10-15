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
    var n = m1.cols;

    for (var r = 0; r < m1.rows; ++r) {
        for (var c = 0; c < m2.cols; ++c) {
            product.values[r][c] = 0;
            //at r,c we want the sum of the products of row r of m1 times col c of m2
            for (var i = 0; i < n; ++i) {
                product.values[r][c] += m1.values[r][i] * m2.values[i][c];
            }
        }
    }

    return product;
};

Matrix.xRotationalMatrix = function (angle) {
    var rad = (angle / 180.0) * Math.PI;
    var s = Math.sin(rad);
    var c = Math.cos(rad);

    var m = new Matrix(3, 3,
                            1, 0, 0,
                            0, c, -s,
                            0, s, c);
    return m;
};

Matrix.yRotationalMatrix = function (angle) {
    var rad = (angle / 180.0) * Math.PI;
    var s = Math.sin(rad);
    var c = Math.cos(rad);

    var m = new Matrix(3, 3,
                            c, 0, s,
                            0, 1, 0,
                            -s, 0, c);
    return m;
};

Matrix.zRotationalMatrix = function (angle) {
    var rad = (angle / 180.0) * Math.PI;
    var s = Math.sin(rad);
    var c = Math.cos(rad);

    var m = new Matrix(3, 3,
                            c, -s, 0,
                            s, c, 0,
                            0, 0, 1);
    return m;
};

Matrix.xyzRotationalMatrix = function (xAngle, yAngle, zAngle) {
    var xMatrix = Matrix.xRotationalMatrix(xAngle);
    var yMatrix = Matrix.yRotationalMatrix(yAngle);
    var zMatrix = Matrix.zRotationalMatrix(zAngle);

    var xy = Matrix.multiply(xMatrix, yMatrix);
    var xyz = Matrix.multiply(xy, zMatrix);

    return xyz;
};
