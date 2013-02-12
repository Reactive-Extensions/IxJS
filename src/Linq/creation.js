   
    /// <summary>
    /// Generates a sequence that contains one repeated value.
    /// </summary>
    /// <param name="element">The value to be repeated.</param>
    /// <param name="count">The number of times to repeat the value in the generated sequence.</param>
    /// <returns>Sequence that contains a repeated value.</returns>
     */
    Enumerable.repeat = function (element, count) {
        return new Enumerable(function () {
            var ct = count, current;
            return enumeratorCreate(
                function () {
                    current = element;
                    if (count == null) {
                        return true;
                    }
                    if (ct > 0) {
                        ct--;
                        return true;
                    } 
                    return false;
                },
                function () { return element; }
            );
        });
    };