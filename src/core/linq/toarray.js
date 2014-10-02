  /**
   * Creates an array from an Enumerable.
   * @returns {Array} An array that contains the elements from the input sequence.
   */  
  enumerableProto.toArray = function () {
    var results = [], it = this[$iterator$]();
    while (1) {
      var next = it.next();
      if (next.done) { return results; }
      results.push(next.value);
    }
  };
