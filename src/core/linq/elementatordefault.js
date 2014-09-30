  /**
   * Returns the element at a specified index in a sequence or a default value if the index is out of range.
   * @param {Number} index The zero-based index of the element to retrieve.
   * @param {Any} [defaultValue] Default value if out of range. If not specified, defaults to undefined.
   * @returns {Any} The default value specified if the index is outside the bounds of the source sequence; otherwise, the element at the specified position in the source sequence.
   */
  enumerableProto.elementAtOrDefault = function (index, defaultValue) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    var n = +index || 0;
    Math.abs(n) === Infinity && (n = 0);
    if (n < 0) { throw new RangeError('index cannot be less than zero.'); }
    var it = this[$iterator$](), i = 0;
    while (1) {
      var next = it.next();
      if (next.done) { return defaultValue; }
      if (i++ === index) { return next.value; }
    }
  };
