    /**
   * Creates a new instance of the AsyncIterable object with a function factory.
   * @param {Function | Object} iterator A factory function which produces an AsyncIterator
   */
  var AsyncIterable = Ix.AsyncIterable = function (iterator) {
    if (typeof iterator !== 'function') {
      throw new TypeError('Must be iterable or a function which produces an iterable.')
    }
    this._iterator = iterator;
  };

  AsyncIterable.prototype[$iterator$] = function () {
    return this._iterator();
  };

  var asyncIterable = AsyncIterable.prototype;
