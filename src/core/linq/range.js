  /** 
   * Generates a sequence of integral numbers within a specified range.
   *
   * @param {Number} start The value of the first integer in the sequence.
   * @param {Number} count The number of sequential integers to generate.
   * @returns {Enumerable} An Enumerable that contains a range of sequential integral numbers.
   */  
  Enumerable.range = function (start, count) {
    return new Enumerable(function () {
      var current = start - 1, end = start + count - 1;
      return new Enumerator(function () {
        return current++ < end ?
          { done : false, value: current } :
          doneEnumerator;
      });
    });
  };
