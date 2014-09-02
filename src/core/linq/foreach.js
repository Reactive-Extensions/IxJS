  /**
   * Performs the specified action on each element of the Enumerable sequence
   *
   * @example
   * sequence.forEach(function (item, index, seq) { console.log(item); });
   *
   * @param {Function} callback Function to execute for each element, taking three arguments:
   *      currentValue - The current element being processed in the Enumerable.
   *      index - The index of the current element being processed in the Enumerable.
   *      enumerable - The Enumerable forEach was called upon.
   * @param {Any} [thisArg] Value to use as this when executing callback.
   */  
  enumerableProto.forEach = function (callback, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    if (!isFunction(callback)) {
      throw new TypeError();
    }
    var index = 0,
        iterable = this[$iterator$]();
    while (1) {
      var next = iterable.next();
      if (next.done) { return; }
      callback.call(thisArg, next.value, index++, this);
    }
  };
