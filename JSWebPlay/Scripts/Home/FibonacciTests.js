///<reference path="CalcLib.js"/>

module("Fibonacci tests");

test("Fibonacci of one", function () {
    var n = 1;
    var expected = 1;
    var actual = CalcLib.fib(n);
    equal(actual, expected, "fib(1) is 1");
});

test("Fibonacci of two", function () {
    var n = 2;
    var expected = 1;
    var actual = CalcLib.fib(n);
    equal(actual, expected, "fib(2) is 1");
});

test("Fibonacci of three", function () {
    var n = 3;
    var expected = 2;
    var actual = CalcLib.fib(n);
    equal(actual, expected, "fib(3) is 2");
});

test("Fibonacci of four", function () {
    var n = 4;
    var expected = 3;
    var actual = CalcLib.fib(n);
    equal(actual, expected, "fib(4) is 3");
});

test("Fibonacci of five", function () {
    var n = 5;
    var expected = 5;
    var actual = CalcLib.fib(n);
    equal(actual, expected, "fib(5) is 5");
});

test("Fibonacci of negative", function () {
    var n = -1;
    var actual = CalcLib.fib(n);
    equal(actual, undefined, "fib(-1) is undefined");
});
