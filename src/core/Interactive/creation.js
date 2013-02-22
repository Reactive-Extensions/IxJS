
    /**
     * Returns a sequence that throws an exception upon enumeration.
     * 
     * @param exception Exception to throw upon enumerating the resulting sequence.
     * @return Sequence that throws the specified exception upon enumeration.
     */
    Enumerable.throwException = function (value) {
        return new Enumerable(function () {
            return enumeratorCreate(
                function () { throw value; },
                noop);
        });
    };

    /**
     * Creates an enumerable sequence based on an enumerable factory function.
     * 
     * @param enumerableFactory Enumerable factory function.
     * @return Sequence that will invoke the enumerable factory upon a call to GetEnumerator.
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
     * 
     * @param initialState Initial state of the generator loop.
     * @param condition Loop condition.
     * @param iterate State update function to run after every iteration of the generator loop.
     * @param resultSelector Result selector to compute resulting sequence elements.
     * @return Sequence obtained by running the generator loop, yielding computed elements.
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
     * 
     * @param resourceFactory Resource factory function.
     * @param enumerableFactory Enumerable factory function, having access to the obtained resource.
     * @return Sequence whose use controls the lifetime of the associated obtained resource.
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
