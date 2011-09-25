function EmpDetailer(emp, orgDataParser) {
    this.emp = emp;
    this.orgDataParser = orgDataParser;
};

EmpDetailer.prototype.display = function () {

    $("#empDetail").slideDown("slow");

    $("#infoDataName").text(this.emp.Name);
    $("#infoDataTitle").text(this.emp.Title);
    $("#infoDataOffice").text(this.emp.Office);
    $("#infoDataSupervisor").text(this.emp.Supervisor ? this.emp.Supervisor.Name : "");

    this.displayDirectReports();
    this.displayIndirectReports();
};

EmpDetailer.prototype.displayDirectReports = function () {
    var ulList = $("#directReportsList");
    var reports = this.getDirectReports();
    OrgUtils.sortEmpArray(reports);
    this.displayReportsInList(reports, ulList);
    //Change the header to show the count
    $("#directReports h1").text("Direct Reports (" + reports.length + ")");

};

EmpDetailer.prototype.displayIndirectReports = function () {
    var ulList = $("#inDirectReportsList");
    var reports = this.getIndirectReports();
    OrgUtils.sortEmpArray(reports);
    this.displayReportsInList(reports, ulList);
    //Change the header to show the count
    $("#inDirectReports h1").text("Indirect Reports (" + reports.length + ")");
};

EmpDetailer.prototype.displayReportsInList = function (reports, ulList) {
    ulList.empty();
    for (var i = 0; i < reports.length; i++) {
        var report = reports[i];
        var li = $("<li><span class='reportName' data-id='" + report.Id + "' >" + report.Name + "</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class='reportTitle'>(" + report.Title + ")</span></li>");
        li.appendTo(ulList);

        //If he clicks on one of the employees in the list, replace this employee being
        //displayed with that of the report emmployee and redisplay
        
        var detailerObj = this;
        $("span.reportName", li).click(function () {
            //here this is the clicked span
            var reportId = $(this).attr("data-id");
            detailerObj.emp = detailerObj.orgDataParser.lookupEmployee(reportId);
            detailerObj.display();
        });
    }
};


EmpDetailer.prototype.getAllReports = function () {
    var allReports = [];
    getAllReportsRecurse(this.emp);
    return allReports;

    function getAllReportsRecurse(emp) {
        if (emp != null && emp.DirectReports != undefined) {
            for (var i = 0; i < emp.DirectReports.length; i++) {
                var report = emp.DirectReports[i];
                allReports.push(report);
                getAllReportsRecurse(report);
            }
        }

    };
};

EmpDetailer.prototype.getDirectReports = function () {
    if (this.emp.DirectReports == undefined) {
        return [];
    }
    return this.emp.DirectReports;
};

EmpDetailer.prototype.getIndirectReports = function () {
    var indirectReports = [];
    var supervisor = this.emp;
    if (supervisor.DirectReports != undefined) {
        var allReports = this.getAllReports();
        //Look through each report and if the guy is not a direct report, add him to
        //the indirectReports array.
        $.each(allReports, function (i, e) {
            var found = false;
            for (var j = 0; !found && j < supervisor.DirectReports.length; j++) {
                var report = supervisor.DirectReports[j];
                found = (report == e);
            }
            if (!found) {
                indirectReports.push(e);
            }
        });
    }
    return indirectReports;
};

EmpDetailer.prototype.supervisorClick = function () {
    if (this.emp.Supervisor) {
        //display the supervisor
        this.emp = this.emp.Supervisor;
        this.display();
    }
};



