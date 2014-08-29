  enumerableProto.map = function (selector, thisArg) {
    var self = this;
    return new Enumerable(function () {
      var index = 0, iterator;
      return new Enumerator(function () {
        iterator || (iterator = self[$iterator$]());
        var next = iterator.next();
        return next.done ?
          doneEnumerator :
          { done: false, value: selector.call(thisArg, next.value, index++, self) };
      });
    });
  };
