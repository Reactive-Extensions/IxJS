
    /** 
     * Determines whether an enumerable sequence is empty.
     * @return {Boolean} true if the sequence is empty; false otherwise.
     */
    EnumerablePrototype.isEmpty = function () {
        return !this.any();
    };

    function extremaBy (source, keySelector, comparer) {
        var result = [], e = source.getEnumerator();
        try {
            if (!e.moveNext()) { throw new Error(seqNoElements); }

            var current = e.getCurrent(),
                resKey = keySelector(current);
            result.push(current);

            while (e.moveNext()) {
                var cur = e.getCurrent(),
                    key = keySelector(cur),
                    cmp = comparer(key, resKey);
                if (cmp === 0) {
                    result.push(cur);
                } else if (cmp > 0) {
                    result = [cur];
                    resKey = key;
                }
            }
        } finally {
            e.dispose();
        }

        return enumerableFromArray(result);
    }

    /**
     * Returns the elements with the minimum key value by using the specified comparer to compare key values.
     * @param keySelector Key selector used to extract the key for each element in the sequence.
     * @param comparer Comparer used to determine the minimum key value.
     * @return List with the elements that share the same minimum key value.
     */
    EnumerablePrototype.minBy = function (keySelector, comparer) {
        comparer || (comparer = defaultComparer);
        return extremaBy(this, keySelector, function (key, minValue) {
            return -comparer(key, minValue);
        });
    };

    /**
     * Returns the elements with the minimum key value by using the specified comparer to compare key values.
     * @param keySelector Key selector used to extract the key for each element in the sequence.
     * @param comparer Comparer used to determine the maximum key value.
     * @return List with the elements that share the same maximum key value.
     */
    EnumerablePrototype.maxBy = function (keySelector, comparer) {
        comparer || (comparer = defaultComparer);
        return extremaBy(this, keySelector, comparer);  
    };