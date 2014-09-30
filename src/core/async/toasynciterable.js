  iterableProto.toAsyncIterable = function () {
    var self = this;
    return new AsyncIterable(function () {
      var i;
      return new AsyncIterator(function () {
        i || (i = self[$iterator$]());
        var next = i.next();
        return next.done ?
          Ix.Promise.resolve(doneIterator) :
          Ix.Promise.resolve({ done: false, next.value });
      });
    });
  };