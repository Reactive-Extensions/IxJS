    function catchExceptionHandler (source, handler) {
        return new Enumerable(function () {
            var current, e, errE;
            return enumeratorCreate(
                function () {
                    e || (e = source.getEnumerator());

                    while (true) {
                        var b, c;
                        try {
                            b = e.moveNext();
                            c = e.getCurrent();
                        } catch (e) {
                            errE = handler(e);
                            break;
                        }

                        if (!b) {
                            return false;
                        }

                        current = c;
                        return true;
                    }

                    if (errE) {
                        e.dispose();
                        e = errE.getEnumerator();
                        if (!e.moveNext()) { return false; }
                        current = e.getCurrent();
                        return true;
                    }
                }, 
                function () { return current; }, 
                function () {
                    e && e.dispose();
                });
        });
    }

    /**
     * Creates a sequence that returns the elements of the first sequence, switching to the second in case of an error.
     * @param second Second sequence, concatenated to the result in case the first sequence completes exceptionally or handler to invoke when an exception of the specified type occurs.
     * @return The first sequence, followed by the second sequence in case an error is produced.
     */
    EnumerablePrototype.catchException = function (secondOrHandler) {
        return typeof secondOrHandler === 'function' ?
            catchExceptionHandler(this, secondOrHandler) :
            enumerableCatch(this, secondOrHandler);
    };

    /**
     * Creates a sequence by concatenating source sequences until a source sequence completes successfully.
     * @return Sequence that continues to concatenate source sequences while errors occur.
     */
    var enumerableCatch = Enumerable.catchException = function () {
        var array = arguments;
        return new Enumerable(function () {
            var index = 0, current, e, error;
            return enumeratorCreate(
                function () {
                    if (index < array.length) {
                        e || (e = array[index++].getEnumerator());
                        while (true) {
                            var b, c;
                            try {
                                b = e.moveNext();
                                c = e.getCurrent();
                            } catch (err) {
                                error = err;
                                break;
                            }

                            if (!b) {
                                e.dispose();
                                e = null;
                                break;
                            }

                            current = c;
                            return true;
                        }
                        if (!error) {  return false; }
                    }
                    if (error) {  throw error; }

                    return false;
                },
                function () { return current; },
                function () { e && e.dispose(); }
            );
        });        
    };

    /**
     * Creates a sequence whose termination or disposal of an enumerator causes a finally action to be executed.
     * @param finallyAction Action to run upon termination of the sequence, or when an enumerator is disposed.
     * @return Source sequence with guarantees on the invocation of the finally action.
     */
    EnumerablePrototype.finallyDo = function (finallyAction) {
        var parent = this;
        return new Enumerable(function () {
            var e, finallyCalled = false;
            return enumeratorCreate(
                function () { 
                    e || (e = parent.getEnumerator());

                    var next;
                    try {
                        next = e.moveNext();
                        if (!next) {
                            finallyAction();
                            finallyCalled = true;
                            return false;
                        }
                        return next;                       
                    } catch (e) {
                        finallyAction();
                        finallyCalled = true;
                        throw e;
                    }
                },
                function () { return e.getCurrent(); },
                function () {
                    !finallyCalled && finallyAction();
                    e && e.dispose();
                }
            );
        });
    };

    /**
     * Creates a sequence that concatenates both given sequences, regardless of whether an error occurs.
     * @param second Second sequence.
     * @return Sequence concatenating the elements of both sequences, ignoring errors.
     */
    EnumerablePrototype.onErrorResumeNext = function (second) {
        return onErrorResumeNext.apply(null, [this, second]);
    };

    /**
     * Creates a sequence that concatenates the given sequences, regardless of whether an error occurs in any of the sequences.
     * @return Sequence concatenating the elements of the given sequences, ignoring errors.
     */
    var onErrorResumeNext = Enumerable.onErrorResumeNext = function () {
        var sources = arguments;
        return new Enumerable(function () {
            var current, index = 0, inner;
            return enumeratorCreate(function () {
                while (index < sources.length) {
                    inner || (inner = sources[index].getEnumerator());
                    try {
                        var result = inner.moveNext();
                        if (result) {
                            current = inner.getCurrent();
                            return true;
                        }
                    }
                    catch (e) { }
                    inner.dispose();
                    inner = null;
                    index++;
                }
                return false;
            },
            function () { return current; },
            function () { inner && inner.dispose(); });
        });
    };

    /**
     * Creates a sequence that retries enumerating the source sequence as long as an error occurs, with the specified maximum number of retries.
     * @param retryCount Maximum number of retries.
     * @return Sequence concatenating the results of the source sequence as long as an error occurs.
     */
    EnumerablePrototype.retry = function (count) {
        var parent = this;
        return new Enumerable(function () {
            var current, e, myCount = count;
            if (myCount == null) {
                myCount = -1;
            }
            return enumeratorCreate(
                function () {
                    e || (e = parent.getEnumerator());
                    while (true) {
                        try {
                            if (e.moveNext()) {
                                current = e.getCurrent();
                                return true;
                            } else {
                                return false;
                            }
                        }
                        catch (e) {
                            if (myCount-- === 0) { throw e; }
                        }
                    }
                },
                function () { return current; },
                function () { e.dispose(); }
            );
        });
    };