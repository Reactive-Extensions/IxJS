  /**
   * Returns the first element in a sequence that satisfies a specified condition if specified, else the first element.
   * @param {Function} [predicate] A function to test each element for a condition
   *  predicate is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      iterable - The Iterable object being traversed
   * @param {Any} [thisArg] Object to use as this when executing predicate.
   * @returns {Any} The first element in the sequence that passes the test in the specified predicate function if specified, else the first element.
   */  
  enumerableProto.firstOrDefault = function (predicate, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    if (predicate && !isFunction(predicate)) {
      throw new TypeError();
    }
    var index = 0,
        iterable = this[$iterator$]();
    while (1) {
      var next = iterable.next();
      if (next.done) { return undefined; }
      if (predicate && predicate.call(thisArg, next.value, index++, this)) {
        return next.value;
      }
    }
  };
