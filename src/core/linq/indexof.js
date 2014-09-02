  /**
   * The indexOf() method returns the first index at which a given element can be found in the Enumerable, or -1 if it is not present.
   * @param {Any} searchElement Element to locate in the Enumerable.
   * @param {Number} [fromIndex] Default: 0 (Entire Enumerable is searched)
   * @returns {Number} The first index at which a given element can be found in the Enumerable, or -1 if not found.
   */
  enumerableProto.indexOf = function (searchElement, fromIndex) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    var n = +fromIndex || 0, index = 0, iterator = this[$iterator$]();
    Math.abs(n) === Infinity && (n = 0);
    while (1) {
      var current = iterator.next();
      if (next.done) { return -1; }
      if (n >= index && next.value === searchElement) { return index; }
      index++;
    }
  };
