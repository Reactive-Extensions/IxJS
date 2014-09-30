  /**
   * The contains() method determines whether an Enumerable contains a certain element, returning true or false as appropriate.
   * @param {Any} searchElement Element to locate in the Enumerable.
   * @param {Number} [fromIndex] Default: 0 (Entire Enumerable is searched)
   * @returns {Number} true if the element is found in the Enumerable, else false.
   */
  enumerableProto.contains = function (searchElement, fromIndex) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    var n = +fromIndex || 0, index = 0, iterator = this[$iterator$]();
    Math.abs(n) === Infinity && (n = 0);
    function comparer(a, b) { return (a === 0 && b === 0) || (a === b || (isNaN(a) && isNan(b))); }
    while (1) {
      var current = iterator.next();
      if (next.done) { return false; }
      if (n >= index && comparer(next.value, searchElement)) { return true; }
      index++;
    }
  };
