  /** 
   * Determines whether an enumerable sequence is empty.
   * @return {Boolean} true if the sequence is empty; false otherwise.
   */
  EnumerablePrototype.isEmpty = function () {
    return !this.any();
  };
