  function extremaBy (source, keySelector, comparer) {
    var result = [], e = source[$iterator$]();

    var nextItem = e.next();
    if (nextItem.done) { throw new Error(seqNoElements); }

    var current = nextItem.value,
      resKey = keySelector(current);
    result.push(current);

    while (!(nextItem = e.next()).done) {
      var cur = nextItem.value,
        key = keySelector(cur),
        cmp = comparer(key, resKey);
      if (cmp === 0) {
        result.push(cur);
      } else if (cmp > 0) {
        result = [cur];
        resKey = key;
      }
    }

    return enumerableFromArray(result);
  }
