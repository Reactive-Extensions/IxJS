  /**
   * Produces the set difference of two sequences by using the specified comparer function to compare values.
   * @param {Any} other An Enumerable whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @returns {Enumerable} A sequence that contains the set difference of the elements of two sequences.
   */
  enumerableProto.except = function (other) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    var source = this;
    return new Enumerable(function () {
      Array.isArray(other) && (other = Enumerable.from(other));
      var otherMap = [], otherIt = other[$iterator$](), otherNext;
      do {
        otherNext = otherIt.next();
        otherNext.done || otherMap.push(otherNext.value);
      } while (!other.done);

      var it;
      return new Enumerator(function () {
        it || (it = source[$iterator$]());
        while (1) {
          var next = it.next();
          if (next.done) { return doneIterator; }
          if (otherMap.indexOf(next.value) === -1) {
            otherMap.push(next.value);
            return { done: false, value: next.value };
          }
        }
      });
    });
  };
