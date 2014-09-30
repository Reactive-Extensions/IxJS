  /**
   * Returns distinct elements from a sequence.
   * @returns {Observable} The distinct values from a sequence.
   */
  enumerableProto.distinct = function () {
    var source = this;
    return new Enumerable(function () {
      var it, map = [];
      return new Enumerator(function () {
        while (1) {
          var next = it.next();
          if (next.done) { return doneIterator; }
          if (!map.indexOf(next.value)) {
            map.push(next.value);
            return { value: next.value, done: false };
          }
        }
      });
    });
  };
