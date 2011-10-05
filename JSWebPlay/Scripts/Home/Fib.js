$(function () {
    $("#CtlCalcBtn").click(CalcFib);
});

function CalcFib() {
    var n = parseInt($("#CtlInputNumber").val());
    var line = "";
    for (var i = 1; i <= n; ++i) {
        var f = CalcLib.fib(i);
        line = line + " " + f;
    }
    ShowResult(line);
}
