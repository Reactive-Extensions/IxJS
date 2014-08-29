  /**
   * Performs the specified action on each element of the Enumerable sequence
   *
   * @example
   * sequence.forEach(function (item, index, seq) { console.log(item); });
   *
   * @param {Function} action The function to perform on each element of the Enumerable sequence.
   *  action is invoked with three arguments:
   *      the element value
   *      the element index
   *      the Enumerable sequence being traversed
   */  
  enumerableProto.forEach = function (selector, thisArg) {
    var index = 0,
        iterable = this[$iterator$]();
    while (1) {
      var next = iterable.next();
      if (next.done) { return; }
      selector.call(thisArg, next.value, index++, this);
    }
  };
