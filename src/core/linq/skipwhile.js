  /**
   * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements. The element's index is used in the logic of the predicate function.
   * @param {Function} callback 
   *  callback is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      iterable - The Enumerable object being traversed
   * @param {Any} [thisArg] Object to use as this when executing callback.
   * @returns {Enumerable} An Enumerable that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.
   */
  enumerableProto.skipWhile = function (callback, thisArg) {
    var source = this;
    return new Enumerable(function () {
      var skipped = false, i = 0, it = source[$iterator$]();
      return new Enumerator(function () {
        var next;
        if (!skipped) {
          while(1) {
            next = it.next();
            if (next.done) { return doneIterator; }
            if (!callback.call(thisArg, next.value, i++, source)) {
              return { done: false, value: next.value };
            }
            skipped = true;
          }
        }
        next = it.next();
        if (next.done) { return doneIterator; }
        return { done: false, value: next.value };
      });
    });
  };