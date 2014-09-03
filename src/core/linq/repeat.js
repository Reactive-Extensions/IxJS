  /**
   * Generates a sequence that contains one repeated value.
   * @param {Any} value The value to be repeated.
   * @param {Number} repeatCount The number of times to repeat the value in the generated sequence.
   * @returns {Enumerable} An Enumerable that contains a repeated value.
   */  
  Enumerable.repeat = function (value, repeatCount) {
    if (repeatCount < 0) { throw new Error('repeatCount must be greater than zero'); }
    return new Enumerable(function () {
      var left = +repeatCount || 0;
      Math.abs(left) === Infinity && (left = 0);
      return new Enumerator(function () {
        if (left === 0) { return doneEnumerator; }
        if (left > 0) { left--; }
        return { done: false, value: value };
      });
    });
  };
