using System.Web.Mvc;
using OrgServices.Repositories.Implementations;
using OrgServices.Repositories.Interfaces;
using OrgServices.Services.Implementations;
using OrgServices.Services.Interfaces;

namespace JSWebPlay.Controllers {
    public class OrgController : Controller {

        private const string XmlFile = @"C:\Source\Javascript\Html5Explorations\JSWebPlay\Content\Data\EmpInfo-03.xml";

        public ActionResult Index() {
            return View();
        }

        public ActionResult Scale() {
            return View();
        }

        public ActionResult ViewOrg() {
            return View();
        }

        public ActionResult LoadOrgData() {
            IEmployeeRepository employeeRepository = new XmlEmployeeRepository(XmlFile);
            IOrgService orgService = new OrgService(employeeRepository);

            var employeeList = orgService.GetEmployeeList();
            JsonResult result = new JsonResult();
            var data = employeeList;
            result.Data = data;
            return result;
        }
    }
}