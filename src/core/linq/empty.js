  /**
   * Returns an empty Iterable.
   * @returns {Iterable} An empty Iterable
   */  
  Iterable.empty = function () {
    return new Iterable(function () {
      return new Iterator(function () {
        return doneIterator;
      });
    });
  };
