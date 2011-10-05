var CalcLib = (function () {

    var my = {};

    my.factorial = (function () {
        var vals = [1, 1];

        return function (n) {
            if (n < 0)
                return undefined;

            if (vals.length > n) {
                return vals[n];
            }

            vals[n] = n * my.factorial(n - 1);
            return vals[n];
        };
    } ());

    my.fib = (function () {
        var vals = [0, 1, 1, 2];

        return function (n) {
            if (n < 0)
                return undefined;
            
            if (vals.length > n) {
                return vals[n];
            }

            vals[n] = my.fib(n - 2) + my.fib(n - 1);
            return vals[n];
        };
    } ());

    return my;
} ());