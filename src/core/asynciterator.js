  /**
   * Creates a new AsyncIterator with a function to produce the next value.
   */
  var AsyncIterator = Ix.AsyncIterator = function (next) {
    this._next = next;
  };

  /**
   * Returns the next item in the AsyncIterator object
   */
  AsyncIterator.prototype.next = function () {
    return this._next();
  };

  AsyncIterator.prototype[$iterator$] = function () { return this; }
