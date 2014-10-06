  /**
   * Projects each element of a sequence into a new form by incorporating the element's index.
   * 
   * @param {Function} callback A transform function to apply to each source element.
   *  callback is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      iterable - The Enumerable object being traversed   
   * @param {Any} [thisArg] An optional scope for the callback.
   * @returns {Enumerable} An Enumerable whose elements are the result of invoking the transform function on each element of source.
   */  
  enumerableProto.map = function (callback, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    if (!isFunction(callback)) {
      throw new TypeError();
    }
    var source = this;   
    return new Enumerable(function () {
      var index = 0, iterator = source[$iterator$]();
      return new Enumerator(function () {
        var next = iterator.next();
        return next.done ?
          doneIterator :
          { done: false, value: callback.call(thisArg, next.value, index++, source) };
      });
    });
  };
