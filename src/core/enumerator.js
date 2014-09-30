  // Shim in iterator support
  var $iterator$ = (typeof Symbol === 'function' && Symbol.iterator) ||
    '_es6shim_iterator_';
  // Bug for mozilla version
  if (root.Set && typeof new root.Set()['@@iterator'] === 'function') {
    $iterator$ = '@@iterator';
  }

  Ix.iterator = $iterator$;

  var doneIterator = { done: true, value: undefined };

  /**
   * Creates a new Enumerator with a function to produce the next value.
   */
  var Enumerator = Ix.Enumerator = function (next) {
    this._next = next;
  };

  /**
   * Returns the next item in the Enumerator object
   */
  Enumerator.prototype.next = function () {
    return this._next();
  };

  Enumerator.prototype[$iterator$] = function () { return this; }
