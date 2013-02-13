    
    /**
     * Generates a sequence of buffers over the source sequence, with specified length and possible overlap.
     * @param count Number of elements for allocated buffers.
     * @param skip Number of elements to skip between the start of consecutive buffers.
     * @return Sequence of buffers containing source sequence elements.
     */
    EnumerablePrototype.bufferWithCount = function (count, skip) {
        var parent = this;
        if (skip == null) { skip = count; }
        return new Enumerable(function () {
            var buffers = [], i = 0, e, current;
            return enumeratorCreate(
                function () {
                    e || (e = parent.getEnumerator());
                    while (true) {
                        if (e.moveNext()) {
                            if (i % skip === 0) {
                                buffers.push([]);
                            }

                            for (var idx = 0, len = buffers.length; idx < len; idx++) {
                                buffers[idx].push(e.getCurrent());
                            }

                            if (buffers.length > 0 && buffers[0].length === count) {
                                current = Enumerable.fromArray(buffers.shift());
                                ++i;
                                return true;
                            }

                            ++i;
                        } else {
                             if (buffers.length > 0) {
                                current = Enumerable.fromArray(buffers.shift());
                                return true;
                            }
                            return false; 
                        }
                    }
                },
                function () { return current; },
                function () { e.dispose(); });
        });
    };

    /**
     * Ignores all elements in the source sequence.
     * @return Source sequence without its elements.
     */
    EnumerablePrototype.ignoreElements = function() {
        var parent = this;
        return new Enumerable(function () {
            var e;
            return enumeratorCreate(
                function () {
                    e = parent.getEnumerator();
                    while (e.moveNext()) { }
                    return false;
                },
                function () {
                    throw new Error('Operation is not valid due to the current state of the object.');
                },
                function () { e.dispose(); }
            );
        });
    };

    /**
     * Returns elements with a distinct key value by using the specified equality comparer to compare key values.
     * @param keySelector Key selector.
     * @param comparer Comparer used to compare key values.
     * @return Sequence that contains the elements from the source sequence with distinct key values.
     */
    EnumerablePrototype.distinct = function(comparer) {
        comparer || (comparer = defaultEqualityComparer);
        var parent = this;
        return Enumerable(function () {
            var current, map = [], e;
            return enumeratorCreate(
                function () {
                    e || (e = parent.getEnumerator());
                    while (true) {
                        if (!e.moveNext()) { return false; }
                        current = e.getCurrent();
                        if (arrayIndexOf.call(map, current, comparer) === -1) {
                            map.push(current);
                            return true;
                        }
                    }
                },
                function () { return current; },
                function () { e.dispose(); }
            );
        });
    };

    /**
     * Returns consecutive distinct elements based on a key value by using the specified equality comparer to compare key values.
     * @param keySelector Key selector.
     * @param comparer Comparer used to compare key values.
     * @return Sequence without adjacent non-distinct elements.
     */
    EnumerablePrototype.distinctUntilChanged = function (selector, comparer) {
        comparer || (comparer = defaultEqualityComparer);
        var parent = this;
        return new Enumerable(function () {
            var current, index = 0, e;
            return enumeratorCreate(
                function () {
                    e || (e = parent.getEnumerator());
                    while (true) {
                        if (!e.moveNext()) {
                            return false;
                        }
                        var next = e.getCurrent();
                        if (!defaultComparer(current, next)) {
                            current = next;
                            return true;
                        }
                    }
                },
                function () { return current; },
                function () { e.dispose(); });
        });
    };

    /**
     * Expands the sequence by recursively applying a selector function.
     * @param selector Selector function to retrieve the next sequence to expand.
     * @return Sequence with results from the recursive expansion of the source sequence.
     */
    EnumerablePrototype.expand = function(selector) {
        var parent = this;
        return enumerableCreate(function () {
            var current, q = [parent], inner;
            return enumeratorCreate(
                function () {
                    while (true) {
                        if (!inner) {
                            if (q.length === 0) { return false; }
                            inner = q.shift().getEnumerator();
                        }
                        if (inner.moveNext()) {
                            current = inner.getCurrent();
                            q.push(selector(current));
                            return true;
                        } else {
                            inner.dispose();
                            inner = null;
                        }
                    }
                },
                function () { return current; },
                function () { inner && inner.dispose(); }
            );
        });
    };

    /**
     * Returns the source sequence prefixed with the specified value.
     * @param values Values to prefix the sequence with.
     * @return Sequence starting with the specified prefix value, followed by the source sequence.
     */
    EnumerablePrototype.startWith = function () {
        return enumerableConcat(enumerableFromArray(slice.call(arguments)), this);
    };

    function scan (seed, accumulator) {
        var source = this;
        return enumerableDefer(function () {
            var accumulation, hasAccumulation = false;
            return source.select(function (x) {
                if (hasAccumulation) {
                    accumulation = accumulator(accumulation, x);
                } else {
                    accumulation = accumulator(seed, x);
                    hasAccumulation = true;
                }
                return accumulation;
            });
        });
    }

    function scan1 (accumulator) {
        var source = this;
        return enumerableDefer(function () {
            var accumulation, hasAccumulation = false;
            return source.select(function (x) {
                if (hasAccumulation) {
                    accumulation = accumulator(accumulation, x);
                } else {
                    accumulation = x;
                    hasAccumulation = true;
                }
                return accumulation;
            });
        });
    };    

    /**
     * Generates a sequence of accumulated values by scanning the source sequence and applying an accumulator function.
     * @param seed Accumulator seed value.
     * @param accumulator Accumulation function to apply to the current accumulation value and each element of the sequence.
     * @return Sequence with all intermediate accumulation values resulting from scanning the sequence.
     */
    EnumerablePrototype.scan = function (/* seed, accumulator */) {
        var f = arguments.length === 1 ? scan1 : scan;
        return f.apply(this, args);
    };

    /**
     * Returns a specified number of contiguous elements from the end of the sequence.
     * @param count The number of elements to take from the end of the sequence.
     * @return Sequence with the specified number of elements counting from the end of the source sequence.
     */
    EnumerablePrototype.takeLast = function (count) {
        var parent = this;
        return new Enumerable(function () {
            var current, e, q;
            return enumeratorCreate(
                function () {
                    e || (e = parent.getEnumerator());
                    if (!q) {
                        q = [];
                        while (e.moveNext()) {
                            q.push(e.getCurrent());
                            if (q.length > count) {
                                q.shift();
                            }
                        }
                    }
                    if (q.length === 0) {
                        return false;
                    }
                    current = q.shift();
                    return true;
                },
                function () { return current; },
                function () { e.dispose(); }
            );
        });
    };

    /**
     * Bypasses a specified number of contiguous elements from the end of the sequence and returns the remaining elements.
     * @param count The number of elements to skip from the end of the sequence before returning the remaining elements.
     * @return Sequence bypassing the specified number of elements counting from the end of the source sequence.
     */
    EnumerablePrototype.skipLast = function (count) {
        var parent = this;
        return new Enumerable(function () {
            var current, e, q = [];
            return enumeratorCreate(
                function () {
                    e || (e = parent.getEnumerator());
                    while (true) {
                        if (!e.moveNext()) {
                            return false;
                        }
                        q.push(e.getCurrent());
                        if (q.length > count) {
                            current = q.shift();
                            return true;
                        }
                    }
                },
                function () { return current; },
                function () { enumerator.dispose(); }
            );
        });
    };

    /**
     * Repeats and concatenates the source sequence the given number of times.
     * @param count Number of times to repeat the source sequence.
     * @return Sequence obtained by concatenating the source sequence to itself the specified number of times.
     */
    EnumerablePrototype.repeat = function (count) {
        var parent = this;
        return enumerableRepeat(0, count).selectMany(function () { return parent; });
    };     
