  /**
   * Projects each element of a sequence to an Enumerable, flattens the resulting sequences into one sequence, and invokes a result selector function on each element therein. The index of each source element is used in the intermediate projected form of that element.
   * 
   * @example
   *   seq.flatMap(new Set([1,2,3,4]))
   *   seq.flatMap(selector);
   *   seq.flatMap(collectionSelector, resultSelector);
   *
   * @param {Function} collectionSelector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
   * @param {Function} [resultSelector] An optional transform function to apply to each element of the intermediate sequence.
   * @returns {Enumerable} An Enumerable whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of source and then mapping each of those sequence elements and their corresponding source element to a result element.
   */  
  enumerableProto.flatMap = function (collectionSelector, resultSelector) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    typeof collectionSelector !== 'function' && (collectionSelector = function () { return collectionSelector; });
    if (resultSelector && !isFunction(resultSelector)) {
      throw new TypeError('resultSelector must be a function');
    }

    var source = this;
    return new Enumerable(function () {
      var index = 0, outerIterator = source[$iterator$](), innerIterator;
      return new Enumerator(function () {
        var outerNext;
        while(1) {
          if (!innerIterator) {
            outerNext = outerIterator.next();
            if (outerNext.done) {
              return doneIterator;
            }

            var innerItem = collectionSelector(outerNext.value, index++, source);
            !isIterable(innerItem) || (innerItem = enumerableFrom(innerItem));
            innerIterator = innerItem[$iterator$]();
          }

          var innerNext = innerIterator.next();
          if (innerNext.done) {
            innerIterator = null;
          } else {
            var current = innerNext.value;
            resulSelector && (current = resulSelector(outerNext.value, current));
            return { done: false, value: current };
          }          
        }
      });
    });
  };
