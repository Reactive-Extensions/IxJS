  /**
   * The Enumerable.of() method creates a new Enumerable instance with a variable number of arguments, regardless of number or type of the arguments.
   * @param {Arguments} ...args Elements of which to create the Enumerable.
   * @returns {Enumerable} An Enumerable instance created by the variable number of arguments, regardless of types.
   */
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