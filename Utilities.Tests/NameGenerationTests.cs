using NUnit.Framework;
using Utilities.Implementations;
using Utilities.Interfaces;
using System.Linq;

namespace Utilities.Tests {

    [TestFixture]
    public class NameGenerationTests : TestBase {

        [Test]
        public void CanGetARandomName() {
            INameGenerator nameGenerator = new NameGenerator();
            string name = nameGenerator.GetRandomName();
            LogMsg("Generated name: {0}", name);
        }

        [Test]
        public void CanChangeNamesInXmlFile() {
            string inputFile = @"C:\Source\Javascript\Html5Explorations\JSWebPlay\Content\Data\EmpInfo-02.xml";
            string outputFile = @"C:\Source\Javascript\Html5Explorations\JSWebPlay\Content\Data\EmpInfo-03.xml";

            INameGenerator nameGenerator = new NameGenerator();
            nameGenerator.ReplaceAllNames(inputFile, outputFile);

        }
    }
}