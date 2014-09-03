  /** 
   * Generates a sequence of integral numbers within a specified range.
   * @param {Number} start The value of the first integer in the sequence.
   * @param {Number} count The number of sequential integers to generate.
   * @returns {Iterable} An Iterable that contains a range of sequential integral numbers.
   */  
  Iterable.range = function (start, count) {
    return new Iterable(function () {
      var current = start - 1, end = start + count - 1;
      return new Iterator(function () {
        return current++ < end ?
          { done : false, value: current } :
          doneIterator;
      });
    });
  };
