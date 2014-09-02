  /**
   * Returns an empty Enumerable.
   * @returns {Enumerable} An empty Enumerable
   */  
  Enumerable.empty = function () {
    return new Enumerable(function () {
      return new Enumerator(function () {
        return doneEnumerator;
      });
    });
  };