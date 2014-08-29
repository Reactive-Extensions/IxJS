  enumerableProto.forEach = function (selector, thisArg) {
    var index = 0,
        iterable = this[$iterator$]();
    while (1) {
      var next = iterable.next();
      if (next.done) { return; }
      selector.call(thisArg, next.value, index++, this);
    }
  };