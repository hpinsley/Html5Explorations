$(function () {
    $("#CtlCalcBtn").click(CalcFactorial);
});

function CalcFactorial() {
    var n = parseInt($("#CtlInputNumber").val());
    var line = "";
    for (var i = 1; i <= n; ++i) {
        var f = CalcLib.factorial(i);
        line = line + " " + f;
    }
    ShowResult(line);
};
