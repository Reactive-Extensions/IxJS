  /**
   * Returns the only element of a sequence, or a default value if the sequence is empty; this method throws an exception if there is more than one element in the sequence.
   * Or returns the only element of a sequence that satisfies a specified condition or a default value if no such element exists; this method throws an exception if more than one element satisfies the condition
   * @param {Function} [predicate] A function to test each element for a condition
   *  predicate is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      iterable - The Enumerable object being traversed
   * @param {Any} [thisArg] Object to use as this when executing predicate.
   * @returns {Any} The single element of the input sequence that satisfies the optional condition, or undefined if no such element is found.
   */
  enumerableProto.single = function (predicate, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    if (predicate && !isFunction(predicate)) {
      throw new TypeError();
    }
    if (predicate) {
      return this.filter(predicate, thisArg).single();
    }
    var it = this[$iterator$](), next = it.next();
    if (next.done) { return undefined; }
    var value = next.value;
    next = it.next();
    if (!next.done) {
      throw new Error('Sequence contains more than one element');
    }
    return value;
  };
