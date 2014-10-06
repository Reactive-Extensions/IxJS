  /** 
   * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
   * @param {Number} count The number of elements to skip before returning the remaining element
   * @returns {Enumerable} An Enumerable that contains the elements that occur after the specified index in the input sequence.
   */
  enumerableProto.skip = function (count) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    +count || (count = 0);
    Math.abs(count) === Infinity && (count = 0);
    if (count < 0) { throw new RangeError(); }
    var source = this; 
    return new Enumerable(function () {
      var skipped = false, it = source[$iterator$]();
      return new Enumerator(function () {
        var next;
        if (!skipped) {
          for (var i = 0; i < count; i++) {
            next = it.next();
            if (next.done) { return doneIterator; }
          }
          skipped = true;
        }
        next = it.next();
        if (next.done) { return doneIterator; }
        return { done: false, value: next.value };
      });
    });
  };