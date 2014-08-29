  var Enumerable = Ix.Enumerable = function (iterator) {
    // TODO: a better check for enumerable
    this._iterator = typeof iterator === 'function' ?
      iterator :
      function () { return iterator; };
  };

  Enumerable.prototype[$iterator$] = function () {
    return this._iterator();
  };

  var enumerableProto = Enumerable.prototype;
