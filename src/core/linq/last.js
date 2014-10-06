  /**
   * Returns the last element of a sequence that satisfies an optional condition if specified, else the last element.
   * @param {Function} predicate 
   *  predicate is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      iterable - The Enumerable object being traversed
   * @param {Any} [thisArg] Object to use as this when executing predicate.
   * @returns {Any} The last element in the sequence that passes the test in the specified predicate function if specified, else the last element.
   */  
  enumerableProto.last = function (predicate, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    if (predicate && !isFunction(predicate)) {
      throw new TypeError();
    }
    var it = this[$iterator$](), next, i = 0, value, hasValue;
    while (!(next = it.next()).done) {
      if (!predicate || predicate.call(thisArg, next.value, i++, this)) {
        hasValue = true;
        value = next.value;
      }
    }
    if (hasValue) { return value; }
    throw new Error(sequenceContainsNoElements);
  };
