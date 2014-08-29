  /**
   * Returns the elements with the minimum key value by using the specified comparer to compare key values.
   * @param {Function} keySelector Key selector used to extract the key for each element in the sequence.
   * @param {Function} [comparer] Comparer used to determine the maximum key value.
   * @return List with the elements that share the same maximum key value.
   */
  EnumerablePrototype.maxBy = function (keySelector, comparer) {
    comparer || (comparer = defaultComparer);
    return extremaBy(this, keySelector, comparer);  
  };
