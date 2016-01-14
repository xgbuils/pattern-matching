var when = (function () {
    var cases = [];
    var current = null;
    
    function build (genericFn, specialCases) {
        return function () {
            var args = [].slice.call(arguments);
            var result;
            for (var i = 0; i < specialCases.length; ++i) {
                var item = specialCases[i]
                if (item.guard(args)) {
                    return item.returns;
                }
            }
            return genericFn.apply(null, args);
        };
    }

    var when = {
        equals: function () {

            var listArgs = [].slice.call(arguments);
            current = {
                guard: function (args) {
                    var length = Math.max(listArgs.length, args.length);
                    for (var i = 0; i < args.length; ++i) {
                        if (args[i] !== listArgs[i]) {
                            return false;
                        }
                    }
                    return true;
                }
            };
            return this;
        },
        returns: function (x) {
            current.returns = x;
            cases.push(current);
            current = null;
            return this;
        },
        otherwise: function (fn) {
            var resultFn = build(fn, cases);
            cases = [];
            return resultFn;
        }
    };
    
    return when;
})();

var fib = when
    .equals(0).returns(1)
    .equals(1).returns(1)
    .otherwise(function (n) {
        return fib (n-1) + fib (n-2);
    });

console.log (
    fib (5),
    fib (8)
);
