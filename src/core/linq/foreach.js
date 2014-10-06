  /**
   * Performs the specified action on each element of the Enumerable sequence
   * @param {Function} callback Function to execute for each element, taking three arguments:
   *      currentValue - The current element being processed in the Enumerable.
   *      index - The index of the current element being processed in the Enumerable.
   *      iterable - The Enumerable forEach was called upon.
   * @param {Any} [thisArg] Value to use as this when executing callback.
   */  
  enumerableProto.forEach = function (callback, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    if (!isFunction(callback)) {
      throw new TypeError();
    }
    var i = 0, it = this[$iterator$](), next;
    while (!(next = it.next()).done) {
      callback.call(thisArg, next.value, i++, this);
    }
  };
