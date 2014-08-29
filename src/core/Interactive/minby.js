  /**
   * Returns the elements with the minimum key value by using the specified comparer to compare key values.
   * @param {Function} keySelector Key selector used to extract the key for each element in the sequence.
   * @param {Function} [comparer] Comparer used to determine the minimum key value.
   * @return {Enumerable} List with the elements that share the same minimum key value.
   */
  EnumerablePrototype.minBy = function (keySelector, comparer) {
    comparer || (comparer = defaultComparer);
    return extremaBy(this, keySelector, function (key, minValue) {
      return -comparer(key, minValue);
    });
  };
