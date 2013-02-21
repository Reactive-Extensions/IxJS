    // Headers
    function noop () { }
    function identity (x) { return x; }
    function defaultComparer (x, y) { return x > y ? 1 : x < y ? -1 : 0; }
    function defaultEqualityComparer(x, y) { return x === y; }
    function defaultSerializer(x) { return x.toString(); }

    var seqNoElements = 'Sequence contains no elements.';
    var invalidOperation = 'Invalid operation';
    var slice = Array.prototype.slice;

    var hasProp = {}.hasOwnProperty;
    var inherits = root.internals.inherits = function (child, parent) {
        for (var key in parent) {
            if (key !== 'prototype' && hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() { this.constructor = child; }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.super_ = parent.prototype;
        return child;
    };
    