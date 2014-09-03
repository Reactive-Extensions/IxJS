  /**
   * Generates a sequence that contains one repeated value.
   * @param {Any} value The value to be repeated.
   * @param {Number} repeatCount The number of times to repeat the value in the generated sequence.
   * @returns {Iterable} An Iterable that contains a repeated value.
   */  
  Iterable.repeat = function (value, repeatCount) {
    if (repeatCount < 0) { throw new Error('repeatCount must be greater than zero'); }
    return new Iterable(function () {
      var left = +repeatCount || 0;
      Math.abs(left) === Infinity && (left = 0);
      return new Iterator(function () {
        if (left === 0) { return doneIterator; }
        if (left > 0) { left--; }
        return { done: false, value: value };
      });
    });
  };
