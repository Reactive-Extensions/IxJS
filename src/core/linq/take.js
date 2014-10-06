  /** 
   * Returns a specified number of contiguous elements from the start of a sequence.
   * @param {Number} count The number of elements to return.
   * @returns {Enumerable} An Enumerable that contains the specified number of elements from the start of the input sequence.
   */
  enumerableProto.take = function (count) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    +count || (count = 0);
    Math.abs(count) === Infinity && (count = 0);
    if (count < 0) { throw new RangeError(); }
    var source = this;
    return new Enumerable(function () {
      var i = count, it = source[$iterator$]();
      return new Enumerator(function () {
        var next = it.next();
        if (next.done) { return doneIterator; }
        if (i-- === 0) { return doneIterator; }
        return { value: next.value, done: false };
      });
    });
  };
