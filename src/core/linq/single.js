  /**
   * Returns the only element of a sequence that satisfies an optional condition, and throws an exception if more than one such element exists.
   * Or returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence.
   * @param {Function} [predicate]
   *  predicate is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      iterable - The Enumerable object being traversed
   * @param {Any} [thisArg] Object to use as this when executing predicate.   
   * @returns {Any} The single element of the input sequence that satisfies a condition if specified, else the first element.
   */
  enumerableProto.single = function (predicate, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    if (predicate && isFunction(predicate)) {
      return this.filter(predicate, thisArg).single();
    }
    var it = this[$iterator$](),
        next = it.next();
    if (next.done) {
      throw new Error(sequenceContainsNoElements);
    }
    var value = next.value;
    next = it.next();
    if (!next.done) {
      throw new Error('Sequence contains more than one element');
    }
    return value;
  };