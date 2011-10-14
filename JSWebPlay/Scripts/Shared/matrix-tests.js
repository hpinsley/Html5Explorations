﻿///<reference path="Matrix.js"/>
module("matrix tests");

test("Can compare two matrices", function () {
    var m1 = new Matrix(3, 3, 1, 0, 0, 0, 1, 0, 0, 0, 1);
    var m2 = new Matrix(3, 3, 1, 0, 0, 0, 1, 0, 0, 0, 1);
    ok(Matrix.equals(m1, m2), "Maxtrix comparison");
});

test("Can compare identity matrices", function () {
    ok(Matrix.equals(Matrix.I2, Matrix.I2), "I2 Identity matrices must be equal");
    ok(Matrix.equals(Matrix.I3, Matrix.I3), "I3 Identity matrices must be equal");
    ok(!Matrix.equals(Matrix.I2, Matrix.I3), "I3 Identity matrices must not equal I2 identity matrix");
});

test("Identity matrix times other matrix equals other matrix", function () {
    var m1 = new Matrix(3, 3, 1, 0, 0, 0, 1, 0, 0, 0, 1);
    var product = Matrix.multiply(Matrix.I3, m1);
    ok(Matrix.equals(product, m1), "Mulitiplying by the identity matrix returns original");
});
