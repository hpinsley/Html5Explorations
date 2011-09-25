using System;
using System.Xml.Linq;
using Utilities.Interfaces;

namespace Utilities.Implementations {
    public class NameGenerator : INameGenerator {

        private Random _random = new Random();
        private string[] _surnames = {
            "SMITH","JOHNSON","WILLIAMS","JONES","BROWN","DAVIS","MILLER","WILSON","MOORE","TAYLOR",
            "ANDERSON","THOMAS","JACKSON","WHITE","HARRIS","MARTIN","THOMPSON","GARCIA","MARTINEZ",
            "ROBINSON","CLARK","RODRIGUEZ","LEWIS","LEE","WALKER","HALL","ALLEN","YOUNG","HERNANDEZ",
            "KING","WRIGHT","LOPEZ","HILL","SCOTT","GREEN","ADAMS","BAKER","GONZALEZ","NELSON","CARTER",
            "MITCHELL","PEREZ","ROBERTS","TURNER","PHILLIPS","CAMPBELL","PARKER","EVANS","EDWARDS","COLLINS",
            "STEWART","SANCHEZ","MORRIS","ROGERS","REED","COOK","MORGAN","BELL","MURPHY","BAILEY","RIVERA",
            "COOPER","RICHARDSON","COX","HOWARD","WARD","TORRES","PETERSON","GRAY","RAMIREZ","JAMES",
            "WATSON","BROOKS","KELLY","SANDERS","PRICE","BENNETT","WOOD","BARNES","ROSS","HENDERSON",
            "COLEMAN","JENKINS","PERRY","POWELL","LONG","PATTERSON","HUGHES","FLORES","WASHINGTON",
            "BUTLER","SIMMONS","FOSTER","GONZALES","BRYANT","ALEXANDER","RUSSELL","GRIFFIN","DIAZ","HAYES"
        };

        private string[] _femaleNames = {
            "MARY", "PATRICIA", "LINDA", "BARBARA", "ELIZABETH", "JENNIFER", "MARIA",
            "SUSAN", "MARGARET",
            "DOROTHY", "LISA", "NANCY", "KAREN", "BETTY", "HELEN", "SANDRA", "DONNA",
            "CAROL", "RUTH",
            "SHARON", "MICHELLE", "LAURA", "SARAH", "KIMBERLY", "DEBORAH", "JESSICA",
            "SHIRLEY", "CYNTHIA",
            "ANGELA", "MELISSA", "BRENDA", "AMY", "ANNA", "REBECCA", "VIRGINIA",
            "KATHLEEN", "PAMELA",
            "MARTHA", "DEBRA", "AMANDA", "STEPHANIE", "CAROLYN", "CHRISTINE", "MARIE",
            "JANET", "CATHERINE",
            "FRANCES", "ANN", "JOYCE", "DIANE", "ALICE", "JULIE", "HEATHER", "TERESA",
            "DORIS", "GLORIA",
            "EVELYN", "JEAN", "CHERYL", "MILDRED", "KATHERINE", "JOAN", "ASHLEY",
            "JUDITH", "ROSE", "JANICE",
            "KELLY", "NICOLE", "JUDY", "CHRISTINA", "KATHY", "THERESA", "BEVERLY",
            "DENISE", "TAMMY", "IRENE",
            "JANE", "LORI", "RACHEL", "MARILYN", "ANDREA", "KATHRYN", "LOUISE", "SARA",
            "ANNE", "JACQUELINE",
            "WANDA", "BONNIE", "JULIA", "RUBY", "LOIS", "TINA", "PHYLLIS", "NORMA",
            "PAULA", "DIANA", "ANNIE",
            "LILLIAN", "EMILY", "ROBIN"
                                        };
                             
        private string[] _maleNames = {
                    "JAMES","JOHN","ROBERT","MICHAEL","WILLIAM","DAVID","RICHARD","CHARLES","JOSEPH",
                    "THOMAS","CHRISTOPHER","DANIEL","PAUL","MARK","DONALD","GEORGE","KENNETH","STEVEN",
                    "EDWARD","BRIAN","RONALD","ANTHONY","KEVIN","JASON","MATTHEW","GARY","TIMOTHY","JOSE",
                    "LARRY","JEFFREY","FRANK","SCOTT","ERIC","STEPHEN","ANDREW","RAYMOND","GREGORY","JOSHUA",
                    "JERRY","DENNIS","WALTER","PATRICK","PETER","HAROLD","DOUGLAS","HENRY","CARL","ARTHUR",
                    "RYAN","ROGER","JOE","JUAN","JACK","ALBERT","JONATHAN","JUSTIN","TERRY","GERALD","KEITH",
                    "SAMUEL","WILLIE","RALPH","LAWRENCE","NICHOLAS","ROY","BENJAMIN","BRUCE","BRANDON","ADAM",
                    "HARRY","FRED","WAYNE","BILLY","STEVE","LOUIS","JEREMY","AARON","RANDY","HOWARD","EUGENE",
                    "CARLOS","RUSSELL","BOBBY","VICTOR","MARTIN","ERNEST","PHILLIP","TODD","JESSE","CRAIG",
                    "ALAN","SHAWN","CLARENCE","SEAN","PHILIP","CHRIS","JOHNNY","EARL","JIMMY","ANTONIO"
                                        };

        public string GetRandomName() {
            if (_random.Next(10) >=5) {
                return GetNameComponent(_surnames) + ", " +
                       GetNameComponent(_maleNames);
            }
            return GetNameComponent(_surnames) + ", " +
                   GetNameComponent(_femaleNames);
        }

        public void ReplaceAllNames(string inputFile, string outputFile) {
            XDocument doc = XDocument.Load(inputFile);
            XElement org = doc.Element("org");

            if (org != null) {
                foreach (XElement element in org.Elements("row")) {
                    var xAttribute = element.Attribute("FullName");
                    if (xAttribute != null) {
                        xAttribute.SetValue(GetRandomName());
                    }
                }
            }
            doc.Save(outputFile);
        }

        private string GetNameComponent(string[] nameArray) {
            string nameComponent = nameArray[_random.Next(nameArray.Length)];
            nameComponent = nameComponent.Substring(0, 1) + nameComponent.Substring(1).ToLower();
            return nameComponent;
        }
    }
}