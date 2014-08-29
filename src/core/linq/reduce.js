  function reduce (source, seed, func) {
    var accumulate = seed, iterator = source[$iterator$](), i = 0;
    while (1) {
      var next = iterator.next();
      if (next.done) { return accumulate; }
      accumulate = func(accumulate, next.value, i++, source);
    }      
  }

  function reduce1 (source, func) {
    var accumulate, iterator = source[$iterator$](), i = 0;
    var next = iterator.next();
    if (next.done) {
      throw new TypeError(sequenceContainsNoElements);
    }
    accumulate = next.value;

    while (1) {
      var next = iterator.next();
      if (next.done) { 
        return accumulate; 
      }
      accumulate = func(accumulate, next.value, i++, source);
    }
  }

  enumerableProto.reduce = function (/*seed, accumulator*/) {
    return arguments.length === 2 ?
      reduce(this, arguments[0], arguments[1]) :
      reduce1(this, arguments[0]);
  };