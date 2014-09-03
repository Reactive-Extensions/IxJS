  /**
   * Projects each element of a sequence into a new form by incorporating the element's index.
   * 
   * @param {Function} selector A transform function to apply to each source element.
   *  selector is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      iterable - The Iterable object being traversed   
   * @param {Any} [thisArg] An optional scope for the selector.
   * @returns {Iterable} An Iterable whose elements are the result of invoking the transform function on each element of source.
   */  
  iterableProto.map = function (selector, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    if (!isFunction(selector)) {
      throw new TypeError();
    }
    var self = this;   
    return new Iterable(function () {
      var index = 0, iterator;
      return new Iterator(function () {
        iterator || (iterator = self[$iterator$]());
        var next = iterator.next();
        return next.done ?
          doneIterator :
          { done: false, value: selector.call(thisArg, next.value, index++, self) };
      });
    });
  };
