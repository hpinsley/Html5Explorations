using System.Web.Mvc;
using JSWebPlay.Services.Implementations;
using JSWebPlay.Services.Interfaces;

namespace JSWebPlay.Controllers
{
    public class GameController : Controller
    {
        private IGameService _gameService;

        public GameController() {
            _gameService = new GameService();
        }

        //
        // GET: /Game/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Jeopardy() {
            return View();
        }

        public ActionResult Maze() {
            return View();
        }

        //Ajax
        public ActionResult GetJeopardyBoard() {
            object gdata = _gameService.GetBoardData();
            
            JsonResult result = new JsonResult();
            result.Data = gdata;
            return result;
        }
    }
}
