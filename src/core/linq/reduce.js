  function reduce (source, func, seed) {
    var accumulate = seed, iterator = source[$iterator$](), i = 0;
    while (1) {
      var next = iterator.next();
      if (next.done) { return accumulate; }
      accumulate = func(accumulate, next.value, i++, source);
    }      
  }

  function reduce1 (source, func) {
    var iterator = source[$iterator$](), i = 0, next = iterator.next();
    if (next.done) {
      throw new TypeError(sequenceContainsNoElements);
    }
    var accumulate = next.value;

    while (1) {
      var next = iterator.next();
      if (next.done) { return accumulate; }
      accumulate = func(accumulate, next.value, i++, source);
    }
  }

  /**
   * The reduce() method applies a function against an accumulator and each value of the Enumerable (from left-to-right) has to reduce it to a single value.S
   * @param {Function} callback Function to execute on each value in the Enumerable, taking four arguments:
   *      previousValue - The value previously returned in the last invocation of the callback, or initialValue, if supplied.
   *      currentValue - The current element being processed in the Enumerable.
   *      index - The index of the current element being processed in the Enumerable.
   *      iterable - The Enumerable forEach was called upon.
   * @param {Any} [thisArg] Value to use as this when executing callback.
   * @returns {Any} The value produced by the accumulator on all values and the initial value, if supplied. 
   */  
  enumerableProto.reduce = function (/*callback, initialValue*/) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    var fn = arguments[0];
    if (!isFunction(fn)) {
      throw new TypeError();
    }        
    return arguments.length === 2 ?
      reduce(this, fn, arguments[1]) :
      reduce1(this, fn);
  };
