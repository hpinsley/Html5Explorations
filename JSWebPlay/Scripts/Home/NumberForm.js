$(function () {
    $("#CtlClearText").click(ClearForm);
});

function ClearForm() {
    $("#CtlText").html("");
    $("#CtlInputNumber").val("");
    $("#CtlInputNumber").focus();
}

function ShowResult(v) {
    $("#CtlResult").html(v);
}

function LogMsg(msg) {
    var oldMsg = $("#CtlText").val();
    if (oldMsg == "")
        $("#CtlText").val(msg);
    else {
        var newMsg = msg + '\n' + oldMsg;
        $("#CtlText").val(newMsg);
    }
}