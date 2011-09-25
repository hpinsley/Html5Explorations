using System.Collections.Generic;
using OrgServices.Models;

namespace OrgServices.Repositories.Interfaces {
    public interface IEmployeeRepository {

        List<EmpRecord> GetEmployeeList();
    }
}