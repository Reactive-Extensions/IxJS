  /**
   * Returns the last element of a sequence that satisfies an optioanl condition or a null if no such element is found.
   * @param {Function} predicate 
   *  predicate is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      iterable - The Enumerable object being traversed
   * @param {Any} [thisArg] Object to use as this when executing predicate.
   * @returns {Any} null if the sequence is empty or if no elements pass the test in the predicate function; otherwise, the last element that passes the test in the predicate function if specified, else the last element.
   */
  enumerableProto.last = function (predicate, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    if (predicate && !isFunction(predicate)) {
      throw new TypeError();
    }
    var it = this[$iterator$](), next, i = 0, value;
    while (!(next = it.next()).done) {
      if (!predicate || predicate.call(thisArg, next.value, i++, this)) {
        value = next.value;
      }
    }
    return value;
  };
