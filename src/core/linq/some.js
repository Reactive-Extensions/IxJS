  /**
   * The some() method tests whether some element in the Iterable passes the test implemented by the provided function.
   * @param {Function} callback Function to test for each element, taking three arguments:
   *    currentValue - The current element being processed in the Iterable.
   *    index - The index of the current element being processed in the Iterable.
   *    iterable - The Iterable some was called upon.
   * @param {Any} [thisArg] Value to use as this when executing callback.
   * @returns {Boolean} true if some element in the Iterable passes the test; else false.
   */
  iterableProto.some = function (callback, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    if (!isFunction(callback)) {
      throw new TypeError();
    }
    var iterator = this[$iterator$](), i = 0;
    while (1) {
      var next = iterator.next();
      if (next.done) { return false; }
      if (callback.call(thisArg, next.value, i++, this)) { return true; }
    }    
  };
