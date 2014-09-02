  /**
   * Returns a number that represents how many elements in the specified sequence satisfy a condition if specified, else the number of items in the sequence.
   *
   * @example
   * sequence.count();
   * sequence.count(function (item, index, seq) { return item % 2 === 0; });
   *
   * @param {Function} [predicate] A function to test each element for a condition, taking three arguments:
   *    currentValue - The current element being processed in the Enumerable.
   *    index - The index of the current element being processed in the Enumerable.
   *    enumerable - The Enumerable some was called upon.   
   * @returns {Number} A number that represents how many elements in the sequence satisfy the condition in the predicate function if specified, else number of items in the sequence.
   */  
  enumerableProto.count = function (predicate, thisArg) {
    if (predicate && !isFunction(predicate)) {
      throw new TypeError('predicate must be a function');
    }
    return predicate ?
      this.filter(predicate, thisArg).count() :
      this.reduce(function (acc) { return acc + 1; }, 0);
  };
