using System.Collections.Generic;
using OrgServices.Models;

namespace OrgServices.Services.Interfaces {
    public interface IOrgService {
        List<EmpRecord> GetEmployeeList();
    }
}