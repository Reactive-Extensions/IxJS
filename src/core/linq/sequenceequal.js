  /** 
   * Determines whether two sequences are equal with an optional equality comparer
   * @param {Enumerable} second An Enumerable to compare to the first sequence.
   * @param {Function} [comparer] An optional function to use to compare elements.
   * @returns {Boolean} true if the two source sequences are of equal length and their corresponding elements compare equal according to comparer; otherwise, false.
   */
  enumerableProto.sequenceEqual = function (second, comparer) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    comparer || (comparer = defaultComparer);
    !isIterable(second) || (second = observableFrom(second));
    var it1 = this[$iterator$](), it2 = second[$iterator$]();
    var next1, next2;
    while (!(next1 = it1.next()).done) {
      if (!((next2 = it2.next()).done && comparer(next1.value, next2.value))) { return false; }
    }
    if (!(next2 = it2.next()).done) { return false; }
    return true;
  };