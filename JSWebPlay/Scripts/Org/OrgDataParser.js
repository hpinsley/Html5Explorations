function OrgDataParser() {
    this.firm = { Id: "0", Name: "Firm", Title: "", Office: "", SupervisorId: null, DirectReports: []};
    this.empDb = {};
    this.empDb[this.firm.Id] = this.firm;   //Add the firm as a pseudo employee
};

OrgDataParser.prototype.parseOrgData = function (orgData) {

    var emp;
    //First ensure all are loaded into the db hashtable
    for (var i = 0; i < orgData.length; ++i) {
        emp = orgData[i];
        this.empDb[emp.Id] = emp;
    }

    //Now if the employee lists a supervisor, link them up by putting the emp in the
    //supervisors DirectReports array and also by linking back to supervisor

    var ceo = null;
    for (var empId in this.empDb) {
        emp = this.empDb[empId];

        if (emp !== this.firm) {
            
            //If the employee has no supervisor or reports to self, make him report to firm
            
            if (emp.SupervisorId === null) {
                emp.SupervisorId = this.firm.Id;
            }
            
            var supervisor = this.empDb[emp.SupervisorId];
            if (supervisor == null || supervisor == emp) {
                emp.SupervisorId = this.firm.Id;
                supervisor = this.firm;
            }

            if (supervisor.DirectReports === undefined) {
                supervisor.DirectReports = [];
            }
            supervisor.DirectReports.push(emp);
            emp.Supervisor = supervisor;
        }
    }
    return this.firm;
};

OrgDataParser.prototype.lookupEmployee = function (id) {
    return this.empDb[id];
};

