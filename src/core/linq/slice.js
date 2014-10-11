  /**
   *
   */
  enumerableProto.slice = function (begin, end) {
    var source = this,
      start = +begin || 0,
      upTo = +end || 0;
    if (start < 0) { throw new RangeError(); }
    if (upTo < 0) { throw new RangeError(); }    
    return new Enumerable(function () {
      var i = 0, it = source[$iterator$]();
      return new Enumerator(function () {
        while (1) {
          var next = it.next();
          if (next.done) { return doneIterator; }
          if (i > upTo) { return doneIterator; }
          if (i++ > start) {
            return { done: false, value: value.next };
          }
        }
      });
    })
  };
