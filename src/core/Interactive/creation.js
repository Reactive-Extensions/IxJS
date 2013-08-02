
    /**
     * Returns a sequence that throws an exception upon enumeration.  An alias for this method is throwException for <IE9.
     * @example
     *  var result = Enumerable.throw(new Error('error'));
     * @param {Object} exception Exception to throw upon enumerating the resulting sequence.
     * @returns {Enumerable} Sequence that throws the specified exception upon enumeration.
     */
    Enumerable['throw'] = Enumerable.throwException = function (value) {
        return new Enumerable(function () {
            return enumeratorCreate(
                function () { throw value; },
                noop);
        });
    };

    /**
     * Creates an enumerable sequence based on an enumerable factory function.
     * @example
     *  var result = Enumerable.defer(function () { return Enumerable.range(0, 10); });
     * @param {Function} enumerableFactory Enumerable factory function.
     * @returns {Enumerable} Sequence that will invoke the enumerable factory upon a call to GetEnumerator.
     */
    var enumerableDefer = Enumerable.defer = function (enumerableFactory) {
        return new Enumerable(function () {
            var enumerator;
            return enumeratorCreate(function () {
                enumerator || (enumerator = enumerableFactory().getEnumerator());
                return enumerator.moveNext();
            }, function () {
                return enumerator.getCurrent();
            }, function () {
                enumerator.dispose();
            });
        });
    };

    /**
     * Generates a sequence by mimicking a for loop.
     * @example
     *  var result = Enumerable.generate(
     *      0,
     *      function (x) { return x < 10; },
     *      function (x) { return x + 1; },
     *      function (x) { return x * x });
     * @param {Any} initialState Initial state of the generator loop.
     * @param {Function} condition Loop condition.
     * @param {Function} iterate State update function to run after every iteration of the generator loop.
     * @param {Function} resultSelector Result selector to compute resulting sequence elements.
     * @returns {Enumerable} Sequence obtained by running the generator loop, yielding computed elements.
     */
    Enumerable.generate = function (initialState, condition, iterate, resultSelector) {
        return new Enumerable(function () {
            var state, current, initialized = false;
            return enumeratorCreate(function () {
                if (!initialized) {
                    state = initialState;
                    initialized = true;
                } else {
                    state = iterate(state);
                    if (!condition(state)) {
                        return false;
                    }
                }
                current = resultSelector(state);
                return true;
            }, function () { return current; });
        });
    };

    /**
     * Generates a sequence that's dependent on a resource object whose lifetime is determined by the sequence usage duration.
     * @example
     *  var result = Enumerable.using(function () { return new QuerySource(); }, function (x) { return x.get(42); });
     * @param {Function} resourceFactory Resource factory function.
     * @param {Function} enumerableFactory Enumerable factory function, having access to the obtained resource.
     * @returns {Enumerable} Sequence whose use controls the lifetime of the associated obtained resource.
     */
    Enumerable.using = function (resourceFactory, enumerableFactory) {
        return new Enumerable(function () {
            var current, first = true, e, res;
            return enumeratorCreate(function () {
                if (first) {
                    res = resourceFactory();
                    e = enumerableFactory(res).getEnumerator();
                    first = false;
                }
                if (!e.moveNext()) {
                    return false;
                }

                current = e.getCurrent();
                return true;
            }, function () {
                return current;
            }, function () {
                e && e.dispose();
                res && res.dispose();
            });
        });
    };
