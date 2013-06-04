    // Headers
    function noop () { }
    function identity (x) { return x; }
    function defaultComparer (x, y) { return x > y ? 1 : x < y ? -1 : 0; }
    function defaultEqualityComparer(x, y) { return x === y; }
    function defaultSerializer(x) { return x.toString(); }

    var seqNoElements = 'Sequence contains no elements.';
    var invalidOperation = 'Invalid operation';
    var slice = Array.prototype.slice;
    