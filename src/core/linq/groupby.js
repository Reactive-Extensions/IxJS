  /**
   * Groups the elements of a sequence according to a specified key selector function and creates a result value from each group and its key. 
   * The elements of each group are projected by using an optional result selector function.
   * @param {Function} keySelector A function to extract the key for each element.
   * @param {Function} [elementSelector] A function to map each source element to an element in grouping.
   * @param {Function} [resultSelector] A function to create a result value from each group.
   * @returns {Enumerable} A collection of elements where each element represents a projection over a group and its key or the value from the
   * result selector function.
   */
  enumerableProto.groupBy = function (keySelector, elementSelector, resultSelector) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    if (!isFunction(keySelector)) {
      throw new TypeError();
    }
    if (!isFunction(elementSelector)) {
      throw new TypeError();
    }
    if (!isFunction(resultSelector)) {
      throw new TypeError();
    }
    var source = this;
    return new Enumerable(function () {
      var m = new Map(), keys = [], it = source[$iterator$](), nextItem;
      do {
        nextItem = it.next();
        var key = keySelector(nextItem.value),
            value = elementSelector ? elementSelector(nextItem.value) : nextItem.value;
        if (!m.has(key)) {
          keys.push(key);
          m.set(key, []);
        }
        m.get(key).push(value);
      } while (!nextItem.done);
    });

    var len = keys.length, i = 0;
    return new Enumerator(function () {
      if (i < len) {
        var k = keys[i],
          values = Observable.from(m.get(k)),
          val;
        if (resultSelector) {
          val = resultSelector(k, values);
        } else {
          val = values;
          val.key = k;
        }
        i++;
        return { done: false, value: val };
      }
      return doneIterator;
    });
  };