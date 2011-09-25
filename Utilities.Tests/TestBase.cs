using System;

namespace Utilities.Tests {

    public class TestBase {
        
        protected void LogMsg(string fmt, params object[] args) {
            string msg = string.Format(fmt, args);
            LogMsg(msg);
        }

        protected void LogMsg(string msg) {
            Console.WriteLine(msg);
        }
    }
}