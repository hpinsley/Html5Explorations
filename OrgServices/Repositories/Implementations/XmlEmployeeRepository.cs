using System.Xml.Linq;
using System.Collections.Generic;
using OrgServices.Models;
using OrgServices.Repositories.Interfaces;

namespace OrgServices.Repositories.Implementations {
    public class XmlEmployeeRepository : IEmployeeRepository {
        private readonly string _xmlFile;
        private XElement _currentEmp;

        public XmlEmployeeRepository(string xmlFile) {
            _xmlFile = xmlFile;
        }

        public List<EmpRecord> GetEmployeeList() {
            XDocument doc = XDocument.Load(_xmlFile);
            XElement root = doc.Root;
            List<EmpRecord> employees = new List<EmpRecord>();

            if (root != null) {
                foreach (XElement emp in root.Elements("row")) {
                    _currentEmp = emp;
                    employees.Add(new EmpRecord {
                                                    Id = A("Id"),
                                                    Name = A("FullName"),
                                                    Title = A("ejtitle"),
                                                    Office = A("PhysOffice"),
                                                    SupervisorId = (string) _currentEmp.Attribute("SuperId"),//We want null if missing
                                                });
                }
            }
            return employees;
        }

        private string A(string attributeName) {
            string val = (string) _currentEmp.Attribute(attributeName);
            return val ?? string.Empty;
        }
    }
}