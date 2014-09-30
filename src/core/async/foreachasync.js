  asyncIterableProto.forEachAsync(action, thisArg) {
    var source = this;
    return new AsyncIterable(function () {
      var i, idx = 0;
      return new AsyncIterable(function () {
        i || (i = source[$iterator$]());
        var next = i.next();
        return next.then(function (x) {
          if (x.done) { return doneEnumerator; }
          return { done: false, value: action.call(thisArg, x.value, i++, source) };
        });
      });
    });
  };
