  Enumerable.repeat = function (value, repeatCount) {
    if (repeatCount < 0) { throw new Error('repeatCount must be greater than zero'); }

    repeatCount == null && (repeatCount = -1);
    
    return new Enumerable(function () {
      var left = repeatCount;
      return new Enumerator(function () {
        if (left === 0) { return doneEnumerator; }
        if (left > 0) { left--; }
        return { done: false, value: value };
      });
    });
  };