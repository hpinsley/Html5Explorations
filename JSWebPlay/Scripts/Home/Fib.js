$(function () {
    $("#CtlCalcBtn").click(CalcFib);
});

function CalcFib() {
    var n = parseInt($("#CtlInputNumber").val());
    var line = "";
    for (var i = 1; i <= n; ++i) {
        var f = fib(i);
        line = line + " " + f;
    }
    ShowResult(line);
}


var fib = (function () {
    var vals = [0, 1, 1, 2];

    return function(n) {
        if (vals.length > n) {
            LogMsg("Quick return " + n + " fib = " + vals[n]);
            return vals[n];
        }

        vals[n] = fib(n - 2) + fib(n - 1);
        LogMsg("Storing value " + vals[n] + " in slot " + n);
        return vals[n];
    };
} ());

