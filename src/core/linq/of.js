  Enumerable.of = function () {
    var args = arguments;
    return new Enumerable(function () {
      var index = -1;
      return new Enumerator(
        function () {
          return ++index < args.length ?
            { done: false, value: args[index] } :
            doneEnumerator;
        });
    });
  };