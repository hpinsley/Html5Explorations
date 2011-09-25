using System.Linq;
using System.Xml.Linq;
using JSWebPlay.Services.Interfaces;
using System.Configuration;

namespace JSWebPlay.Services.Implementations {
    public class GameService : IGameService {
        public object GetBoardData() {

            string gameFile = ConfigurationManager.AppSettings["GameDataFile"];

            XElement root = XElement.Load(gameFile);
            var categories = from c in root.Element("categories").Elements("category")
                             select new {
                                 title = c.Attribute("title").Value,
                                 questions =
                                    (from question in c.Element("questions").Elements("question")
                                     select new { q = question.Attribute("q").Value, a = question.Attribute("a").Value }
                                         ).ToArray()
                             };
            var result =
                new { Categories = categories.ToArray() };

            return result;


        }
    }
}