  /** 
   * Inverts the order of the elements in a sequence.
   * @returns {Enumerable} A sequence whose elements correspond to those of the input sequence in reverse order.
   */
  enumerableProto.reverse = function () {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    var source = this;
    return new Enumerable(function () {
      var it = source[$iterator$](), arr = [], next;
      while (!(next = it.next()).done) {
        arr.unshift(next.value);
      }
      var len = arr.length, i = 0;
      return new Enumerator(function () {
        if (i < len) {
          var value = arr[i++];
          return { done: false, value: value };
        }
        return doneIterator;
      });
    });
  };