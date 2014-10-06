  /**
   * Returns the element at a specified index in a sequence.
   * @param {Number} index The zero-based index of the element to retrieve.
   * @returns {Any} The element at the specified position in the source sequence.
   */
  enumerableProto.elementAt = function (index) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    var n = +index || 0;
    Math.abs(n) === Infinity && (n = 0);
    if (n < 0) { throw new RangeError('index cannot be less than zero.'); }
    var it = this[$iterator$](), i = 0, next;
    while (!(next = it.next()).done) {
      if (i++ === index) { return next.value; }
    }
    throw new RangeError('index is greater than or equal to the number of elements in source');
  };
