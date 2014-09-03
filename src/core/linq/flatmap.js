  /**
   * Projects each element of a sequence to an Iterable, flattens the resulting sequences into one sequence, and invokes a result selector function on each element therein. The index of each source element is used in the intermediate projected form of that element.
   * 
   * @example
   *   seq.flatMap(new Set([1,2,3,4]))
   *   seq.flatMap(selector);
   *   seq.flatMap(collectionSelector, resultSelector);
   *
   * @param {Function} collectionSelector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
   * @param {Function} [resultSelector] An optional transform function to apply to each element of the intermediate sequence.
   * @returns {Iterable} An Iterable whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of source and then mapping each of those sequence elements and their corresponding source element to a result element.
   */  
  iterableProto.flatMap = function (collectionSelector, resultSelector) {
    typeof collectionSelector !== 'function' && (collectionSelector = function () { return collectionSelector; });
    if (resultSelector && !isFunction(resultSelector)) {
      throw new TypeError('resultSelector must be a function');
    }

    var parent = this;
    return new Iterable(function () {
      var index = 0, outerIterator, innerIterator;
      return new Iterator(function () {
        outerIterator || (outerIterator = parent[$iterator$]);
        var outerNext;
        while(1) {
          if (!innerIterator) {
            outerNext = outerIterator.next();
            if (outerNext.done) {
              return doneIterator;
            }

            innerIterator = collectionSelector(outerNext.value, index++, parent)[$iterator$];
          }

          var innerNext = innerIterator.next();
          if (innerNext.done) {
            innerIterator = null;
          } else {
            var current = innerNext.value;
            if (resultSelector) {
              current = resultSelector(outerNext.value, current);
            }
            return { done: false, value: current };
          }          
        }
      });
    });
  };
