  /**
   * Creates an array from an Enumerable.
   * @returns {Array} An array that contains the elements from the input sequence.
   */  
  enumerableProto.toArray = function () {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    var results = [], it = this[$iterator$](), next;
    while (!(next = it.next()).done) {
      results.push(next.value);
    }
    return results;
  };
