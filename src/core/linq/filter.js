  /**
   * Creates a new Enumerable with all elements that pass the test implemented by the provided function.
   * @param {Function} predicate 
   *  predicate is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      iterable - The Enumerable object being traversed
   * @param {Any} [thisArg] Object to use as this when executing predicate.
   * @returns {Enumerable} An Enumerable that contains elements from the input sequence that satisfy the condition.
   */  
  enumerableProto.filter = function (predicate, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    if (!isFunction(predicate)) {
      throw new TypeError();
    }
    var source = this;     
    return new Enumerable(function () {
      var i = 0, it = source[$iterator$]();
      return new Enumerator(function () {
        var next;
        while (!(next = it.next()).done) {
          if (predicate.call(thisArg, next.value, i++, source)) {
            return { done: false, value: next.value };
          }
        }
        return doneIterator;
      });
    });
  };
