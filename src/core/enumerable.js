  /**
   * Creates a new instance of the Enumerable object with either a function factory or an iterable object.
   * @param {Function | Object} iterator A factory function which produces an Iterator or an Enumerable object.
   */
  var Enumerable = Ix.Enumerable = function (iterator) {
    var _iterator;
    if (typeof iterator[$iterator$] === 'function') {
      _iterator = function () { return iterator; };
    } else if (typeof iterator === 'function') {
      _iterator = iterator;
    } else {
      throw new TypeError('Must be iterable or a function which produces an iterable.')
    }
    this._iterator = _iterator;
  };

  Enumerable.prototype[$iterator$] = function () {
    return this._iterator();
  };

  var enumerableProto = Enumerable.prototype;
