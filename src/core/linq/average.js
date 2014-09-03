    /** 
   * Computes the average of a sequence of values that are obtained by invoking a transform function on each element of the input sequence.
   * @param {Function} [selector] An optional transform function to apply to each element.
   *  selector is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      enumerable - The Enumerable object being traversed  
   * @param {Any} [thisArg] An optional scope for the selector.       
   * @returns {Number} The average of the sequence of values.
   */
  iterableProto.average = function(selector, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    if (selector && !isFunction(selector)) {
      throw new TypeError();
    } 
    if (selector && isFunction(selector)) {
      return this.map(selector, thisArg).average();
    }
    var iterator = this[$iterator$](), count = 0, sum = 0;
    while (1) {
      var next = iterator.next();
      if (next.done) { 
        if (count === 0) {
          throw new TypeError(sequenceContainsNoElements);
        }
        return sum / count;
      }
      count++;
      sum += +next.value;
    }
  };