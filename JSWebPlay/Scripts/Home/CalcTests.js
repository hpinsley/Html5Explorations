///<reference path="CalcLib.js"/>

test("factorial of five", function () {
    CalcLib.setLogger(function(msg) { alert(msg); });
    var n = 5;
    var expected = 120;
    var actual = CalcLib.factorial(n);
    equals(actual, expected, "5! factorial is 120");

});

test("Can log a line", function () {
    CalcLib.setLogger(function (msg) { alert("You say " + msg); });
    var x = CalcLib.factorial;
});

