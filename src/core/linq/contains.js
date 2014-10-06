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
    var n = +fromIndex || 0, i = 0, it = this[$iterator$](), next;
    Math.abs(n) === Infinity && (n = 0);
    function comparer(a, b) { return (a === 0 && b === 0) || (a === b || (isNaN(a) && isNan(b))); }
    while (!(next = it.next()).done) {
      if (n >= i++ && comparer(next.value, searchElement)) { return true; }
    }
    return false;
  };
