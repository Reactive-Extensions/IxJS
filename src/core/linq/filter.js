  /**
   * Creates a new Enumerable with all elements that pass the test implemented by the provided function.
   *
   * @param {Function} predicate 
   *  predicate is invoked with three arguments: 
   *      The value of the element
   *      The index of the element
   *      The Enumerable object being traversed
   * @param {Any} [thisArg] Object to use as this when executing predicate.
   * @returns {Enumerable} An Enumerable that contains elements from the input sequence that satisfy the condition.
   */  
  enumerableProto.filter = function (predicate, thisArg) {
    var self = this;
    return new Enumerable(function () {
      var index = 0, iterator;
      return new Enumerator(function () {
        iterator || (iterator = self[$iterator$]());
        while (1) {
          var next = iterator.next();
          if (next.done) { 
            return doneEnumerator;
          }
          if (predicate.call(thisArg, next.value, index++, self)) {
            return { done: false, value: next.value };
          }     
        }
      });
    });
  };
