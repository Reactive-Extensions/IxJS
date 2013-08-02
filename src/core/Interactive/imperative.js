    /**
     * Generates an enumerable sequence by repeating a source sequence as long as the given loop condition holds.
     * An alias for this method is whileDo for browsers <IE9.
     * @example
     *  var result = Enumerable.while(function () { return true; }, Enumerable.range(1, 10));
     * @param {Function} condition Loop condition.
     * @param {Enumerable} source Sequence to repeat while the condition evaluates true.
     * @returns {Enumerable} Sequence generated by repeating the given sequence while the condition evaluates to true.
     */    
    var enumerableWhileDo = Enumerable['while'] = Enumerable.whileDo = function (condition, source) {
        return enumerableRepeat(source).takeWhile(condition).selectMany(identity);
    };

    /**
     * Returns an enumerable sequence based on the evaluation result of the given condition.
     * An alias for this method is ifThen for browsers <IE9
     * @example
     *  var result = Enumerable.if(function () { return true; }, Enumerable.range(0, 10));
     *  var result = Enumerable.if(function () { return false; }, Enumerable.range(0, 10), Enumerable.return(42));
     * @param {Function} condition Condition to evaluate.
     * @param {Enumerable} thenSource Sequence to return in case the condition evaluates true.
     * @param {Enumerable} [elseSource] Optional sequence to return in case the condition evaluates false; else an empty sequence.
     * @return Either of the two input sequences based on the result of evaluating the condition.
     */
    Enumerable['if'] = Enumerable.ifThen = function (condition, thenSource, elseSource) {
        elseSource || (elseSource = enumerableEmpty());
        return enumerableDefer(function () { return condition() ? thenSource : elseSource; });
    };

    /**
     * Generates an enumerable sequence by repeating a source sequence as long as the given loop postcondition holds.
     * @example
     *  var result = Enumerable.doWhile(Enumerable.range(0, 10), function () { return true; });
     * @param {Enumerable} source Source sequence to repeat while the condition evaluates true.
     * @param {Function} condition Loop condition.
     * @returns {Enumerable} Sequence generated by repeating the given sequence until the condition evaluates to false.
     */
    Enumerable.doWhile = function (source, condition) {
        return source.concat(enumerableWhileDo(condition, source));
    };

    /**
     * Returns a sequence from a dictionary based on the result of evaluating a selector function, also specifying a default sequence.
     * An alias for this method is switchCase for browsers <IE9.
     * @example
     *  var result = Enumerable.case(function (x) { return x; }, {1: 42, 2: 25});
     *  var result = Enumerable.case(function (x) { return x; }, {1: 42, 2: 25}, Enumerable.return(56));
     * @param {Function} selector Selector function used to pick a sequence from the given sources.
     * @param {Object} sources Dictionary mapping selector values onto resulting sequences.
     * @param {Enumerable} [defaultSource] Default sequence to return in case there's no corresponding source for the computed selector value; if not provided defaults to empty Enumerable.
     * @returns {Enumerable} The source sequence corresponding with the evaluated selector value; otherwise, the default source.
     */
    Enumerable['case'] = Enumerable.switchCase = function (selector, sources, defaultSource) {
        defaultSource || (defaultSource = enumerableEmpty());
        return enumerableDefer(function () {
            var result = sources[selector()]
            if (!result) {
                result = defaultSource;
            }
            return result;
        });
    };

    /**
     * Generates a sequence by enumerating a source sequence, mapping its elements on result sequences, and concatenating those sequences.
     * An alias for this method is forIn for browsers <IE9.
     * @example
     *  var result = Enumerable.for(Enumerable.range(0, 10), function (x) { return Enumerable.return(x); });
     * @param {Enumerable} source Source sequence.
     * @param {Function} resultSelector Result selector to evaluate for each iteration over the source.
     * @return {Enumerable} Sequence concatenating the inner sequences that result from evaluating the result selector on elements from the source.
     */
    Enumerable['for'] = Enumerable.forIn = function (source, resultSelector) {
        return source.select(resultSelector);
    };
