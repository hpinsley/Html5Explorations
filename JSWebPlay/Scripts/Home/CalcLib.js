var CalcLib = (function () {

    var logger = function () { };

    var my = {};

    my.setLogger = function (logFunc) {
        logger = logFunc;
    };

    my.factorial = (function() {
        var vals = [1, 1];

        return function(n) {
            if (vals.length > n) {
                logger("Quick return " + n + " factorial = " + vals[n]);
                return vals[n];
            }

            vals[n] = n * my.factorial(n - 1);
            logger("Storing value " + vals[n] + " in slot " + n);
            return vals[n];
        };
    }());

    return my;
} ());