OrgUtils = {

    //Sort an array of employees by name in place
    sortEmpArray: function(employees) {
        employees.sort(function (emp1, emp2) {
            if (emp1.Name > emp2.Name) {
                return 1;
            }
            if (emp1.Name < emp2.Name) {
                return -1;
            }
            return 0;
        });
        return employees;
    }

};