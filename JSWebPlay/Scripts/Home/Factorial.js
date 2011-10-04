$(function () {
    $("#CtlCalcBtn").click(CalcFactorial);
});

function CalcFactorial() {
    var n = parseInt($("#CtlInputNumber").val());
    var line = "";
    for (var i = 1; i <= n; ++i) {
        //var f = factorial(i);
        var f = CalcLib.factorial(i);
        line = line + " " + f;
    }
    ShowResult(line);
}


var factorial = (function (logMsg) {
    var vals = [1, 1];

    return function (n) {
        if (vals.length > n) {
            LogMsg("Quick return " + n + " factorial = " + vals[n]);
            return vals[n];
        }

        vals[n] = n * factorial(n - 1);
        LogMsg("Storing value " + vals[n] + " in slot " + n);
        return vals[n];
    };
} ());

