  enumerableProto.filter = function (predicate, thisArg) {
    var self = this;
    return new Enumerable(function () {
      var index = 0, iterator;
      return new Enumerator(function () {
        iterator || (iterator = self[$iterator$]());
        while (1) {
          var next = iterator.next();
          if (next.done) { 
            return doneEnumerator;
          }
          if (predicate.call(thisArg, next.value, index++, self)) {
            return { done: false, value: next.value };
          }     
        }
      });
    });
  };
