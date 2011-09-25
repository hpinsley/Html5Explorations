using System.Collections.Generic;
using OrgServices.Models;
using OrgServices.Repositories.Interfaces;
using OrgServices.Services.Interfaces;

namespace OrgServices.Services.Implementations {
    public class OrgService : IOrgService {
        private readonly IEmployeeRepository _employeeRepository;

        public OrgService(IEmployeeRepository employeeRepository) {
            _employeeRepository = employeeRepository;
        }

        public List<EmpRecord> GetEmployeeList() {
            return _employeeRepository.GetEmployeeList();
        }
    }
}