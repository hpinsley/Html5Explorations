///<reference path="CalcLib.js"/>

module("factorial tests");

test("factorial of zero", function () {
    var n = 0;
    var expected = 1;
    var actual = CalcLib.factorial(n);
    equal(actual, expected, "0! factorial is 1");

});

test("factorial of one", function () {
    var n = 1;
    var expected = 1;
    var actual = CalcLib.factorial(n);
    equal(actual, expected, "1! factorial is 1");

});

test("factorial of five", function () {
    var n = 5;
    var expected = 120;
    var actual = CalcLib.factorial(n);
    equal(actual, expected, "5! factorial is 120");

});

test("factorial of negative", function () {
    var n = -1;
    var actual = CalcLib.factorial(n);
    equal(actual, undefined, "-1! is undefined");
});
