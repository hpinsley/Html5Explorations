using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MobileAppTest.Models;

namespace MobileAppTest.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index() {
            return View();
        }

        public ActionResult Create() {
            Category vm = new Category();
            return View(vm);
        }

        [HttpPost]
        public ActionResult Create(Category viewModel) {
            return RedirectToAction("Index");
        }

    }
}
