  /**
   * Returns elements from a sequence as long as a specified condition is true. The element's index is used in the logic of the callback function.
   * @param {Function} callback 
   *  callback is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      iterable - The Enumerable object being traversed
   * @param {Any} [thisArg] Object to use as this when executing callback.
   * @returns {Enumerable} An Enumerable that contains elements from the input sequence that occur before the element at which the test no longer passes.
   */
  enumerableProto.takeWhile = function (callback, thisArg) {
    var source = this;
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    if (!isFunction(callback)) {
      throw new TypeError();
    }    
    return new Enumerable(function () {
      var i = 0, it = source[$iterator$]();
      return new Enumerator(function () {
        var next = it.next();
        if (next.done) { return doneIterator; }
        if (!callback.call(thisArg, next.value, i++, source)) { return doneIterator; }
        return { done: false, value: next.done };
      });
    });
  };        
