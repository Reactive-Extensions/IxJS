  var SharedBuffer = (function () {
    inherits(SharedBuffer, Enumerable);

    function SharedBuffer (source) {
      this.source = source;
    }

    SharedBuffer.prototype[$iterator$] = function () {
      var current, self = this;
      return new Enumerator(
        function () {
          var nextItem = self.source.next();
          return !nextItem.done ?
            { done: false, value: nextItem.value } :
            doneEnumerator;
        });
    };

    return SharedBuffer;
  }());