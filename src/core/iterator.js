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
   * Creates a new Iterator with a function to produce the next value.
   */
  var Iterator = Ix.Iterator = function (next) {
    this._next = next;
  };

  /**
   * Returns the next item in the Iterator object
   */
  Iterator.prototype.next = function () {
    return this._next();
  };

  Iterator.prototype[$iterator$] = function () { return this; }
