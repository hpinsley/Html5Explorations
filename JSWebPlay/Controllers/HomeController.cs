using System.Web.Mvc;

namespace JSWebPlay.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Fib() {
            return View();
        }

        public ActionResult Factorial() {
            return View();
        }
        public ActionResult CssTests() {
            return View();
        }
    }
}
