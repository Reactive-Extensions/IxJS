  enumerableProto.groupBy = function (keySelector, elementSelector) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    if (!isFunction(keySelector)) {
      throw new TypeError();
    }
    if (elementSelector && !isFunction(elementSelector)) {
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

    return new Enumerator(function () {

    });
  };