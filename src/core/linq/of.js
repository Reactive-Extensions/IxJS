  /**
   * The Iterable.of() method creates a new Iterable instance with a variable number of arguments, regardless of number or type of the arguments.
   * @param {Arguments} ...args Elements of which to create the Iterable.
   * @returns {Iterable} An Iterable instance created by the variable number of arguments, regardless of types.
   */
  Iterable.of = function () {
    var args = arguments;
    return new Iterable(function () {
      var index = -1;
      return new Iterator(
        function () {
          return ++index < args.length ?
            { done: false, value: args[index] } :
            doneIterator;
        });
    });
  };