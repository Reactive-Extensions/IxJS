  /**
   * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is empty.
   *
   * @param {Any} [defaultValue] The value to return if the sequence is empty.
   * @returns {Enumerable} An Enumerable that contains defaultValue if source is empty; otherwise, source.
   */  
  enumerableProto.defaultIfEmpty = function (defaultValue) {
    var source = this;
    return new Enumerable(function () {
      var it, hasValue = false, hasSent = false;
      return new Enumerator(function () {
        it || (it = source[$iterator$]());
        while (1) {
          var next = it.next();
          if (next.done) {
            if (!hasValue && !hasSent) {
              hasSent = true;
              return { value: defaultValue, done: false };
            }
            return doneIterator;
          } 
          hasValue = true;
          return { value: next.value, done: false };
        }
      });
    });
  };
