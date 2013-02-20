    function noop () { }
    function identity (x) { return x; }
    function defaultComparer (x, y) { return x > y ? 1 : x < y ? -1 : 0; }
    function defaultEqualityComparer (x, y) { return x === y; }

    function arrayIndexOf(key, comparer) {
        comparer || (comparer = defaultEqualityComparer);
        for (var i = 0, len = this.length; i < len; i++) {
            if (comparer(key, this[i])) {
                return i;
            }
        }
        return -1;
    }

    var seqNoElements = 'Sequence contains no elements.';
    var objectDisposed = 'Object disposed';
    var slice = Array.prototype.slice;

    var Enumerable = root.Enumerable,
        EnumerablePrototype = Enumerable.prototype,
        enumerableConcat = Enumerable.concat,
        enumerableEmpty = Enumerable.empty,
        enumerableFromArray = Enumerable.fromArray,
        enumerableRepeat = Enumerable.repeat,
        enumeratorCreate = root.Enumerator.create
        inherits = root.internals.inherits;