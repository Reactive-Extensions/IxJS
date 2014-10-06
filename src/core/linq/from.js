  /**
   * The Enumerable.from() method creates a new Enumerable instance from an array-like or iterable object.
   * @param {Any} arrayLike An array-like or iterable object to convert to an Enumerable.
   * @param {Function} [mapFn] Map function to call on every element of the array.
   *  selector is invoked with two arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   * @param {Any} [thisArg] Value to use as this when executing mapFn.
   * @returns {Enumerable} an Enumerable created from the array-like or iterable object.  
   */
  var enumerableFrom = Enumerable.from = function (arrayLike, mapFn, thisArg) {
    var items = Object(arrayLike);
    if (arrayLike == null) {
      throw new TypeError('Enumerable.from requires an array like object');
    }
    if (mapFn && !isFunction(mapFn)) {
      throw new TypeError();
    }

    return new Enumerable(function () {
      var isObjIterable = isIterable(items), 
        iterator = isObjIterable ? items[$iterator$]() : null,
        result, 
        i = 0, 
        value,
        length;
      return new Enumerator(function () {
        if (isObjIterable) {
          var next = iterator.next();
          if (next.done) { return doneIterator; }
          value = next.value;
          if (mapFn) {
            value = mapFn.call(thisArg, value, i++);
          }
          return { done: false, value: value };
        } else {
          length = toLength(items.length);
          if (i < length) {
            value = items[i];
            if (mapFn) {
              value = mapFn.call(thisArg, value, i);
            }
            i++;
            return { done: false, value: value };
          } 
          return doneIterator;
        }
      });
    });
  };
