  /**
   * Computes the sum of the sequence of values that are optionally obtained by invoking a transform function on each element of the input sequence.
   * 
   * @example
   *  res = source.sum();
   *  res = source.sum(function (x) { return x.value; });
   *
   * @param {Function} [selector] A transform function to apply to each element.
   * @returns {Any} The sum of the values.
   */  
  iterableProto.sum = function (selector) {
    if (!isFunction(selector)) {
      throw new TypeError('selector must be a function');
    }
    return selector ?
      this.map(selector).sum() :
      this.reduce(function (acc, x) { return acc + x; });
  };
