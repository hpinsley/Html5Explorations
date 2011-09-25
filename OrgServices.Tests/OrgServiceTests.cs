using System.Collections.Generic;
using NUnit.Framework;
using OrgServices.Repositories.Implementations;
using OrgServices.Repositories.Interfaces;
using OrgServices.Services.Implementations;
using OrgServices.Services.Interfaces;
using OrgServices.Models;

namespace OrgServices.Tests {

    [TestFixture]
    public class OrgServiceTests {
        
        [Test]
        public void CanGetEmployeeListFromXmlDataFile() {

            string xmlFile = @"C:\Source\Javascript\JavaScriptPlay\JSWebPlay\Content\Data\EmpInfo.xml";
            IEmployeeRepository employeeRepository = new XmlEmployeeRepository(xmlFile);
            IOrgService orgService = new OrgService(employeeRepository);
            List<EmpRecord> employeeList = orgService.GetEmployeeList();
            Assert.IsNotNull(employeeList);
            Assert.Greater(employeeList.Count, 0);

        }
    }
}