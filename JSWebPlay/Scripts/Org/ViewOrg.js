var orgCharter;
var empDetailer;
var orgDataParser;

$(function () {
    loadData();
    $("#closeEmpDetailBtn").click(hideEmployeeDetail);
    $("#infoDataSupervisor").click(supervisorClick);
});

function hideEmployeeDetail() {
    $("#empDetail").fadeOut("slow");
};

function getContext() {
    var canvas = $("canvas")[0];
    var ctx = canvas.getContext("2d");
    return ctx;
}

function loadData() {
    var url = "/JSWebPlay/Org/LoadOrgData";

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        success: function (orgData) {
            onLoadComplete(orgData);

        },
        error: function (request, errmsg, error) {
            alert("Error " + errmsg + " " + error + " " + request.responseText);
        }
    });
};

function onLoadComplete(orgData) {
    orgDataParser = new OrgDataParser();
    var ceo = orgDataParser.parseOrgData(orgData);
    var ctx = getContext();
    orgCharter = new OrgCharter(ctx, ceo);
    orgCharter.drawTree();

    //Set up click handler
    $("canvas").click(orgClick);
}

function orgClick(info) {
    var x = info.offsetX;
    var y = info.offsetY;
    if (orgCharter) {
        var emp = orgCharter.findClickedEmp(x, y);
        if (emp != null) {
            empDetailer = new EmpDetailer(emp, orgDataParser);
            empDetailer.display();
        }
    }
};

function supervisorClick() {
    if (empDetailer) {
        empDetailer.supervisorClick();
    }
};