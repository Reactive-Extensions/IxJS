  (function () {
    var maxSafeInteger = Math.pow(2, 53) - 1;

    function isIterable (x) {
      return x != null && Object(x) === x && typeof x[$iterator$] !== 'undefined';
    }

    function toInteger (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    }

    function toLength (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    }

    /**
     * The Iterable.from() method creates a new Iterable instance from an array-like or iterable object.
     * @param {Any} arrayLike An array-like or iterable object to convert to an Iterable.
     * @param {Function} [mapFn] Map function to call on every element of the array.
     *  selector is invoked with two arguments: 
     *      currentValue - The value of the element
     *      index - The index of the element
     * @param {Any} [thisArg] Value to use as this when executing mapFn.
     * @returns {Iterable} an Iterable created from the array-like or iterable object.  
     */
    Iterable.from = function (arrayLike, mapFn, thisArg) {
      var items = Object(arrayLike);
      if (arrayLike == null) {
        throw new TypeError('Iterable.from requires an array like object');
      }
      if (mapFn && !isFunction(mapFn)) {
        throw new TypeError();
      }

      return new Iterable(function () {
        var isObjIterable = isIterable(items), 
          iterator = isObjIterable ? items[$iterator$]() : null,
          result, 
          i = 0, 
          value,
          length;
        return new Iterator(function () {
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
  }());
