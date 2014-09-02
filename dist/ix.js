// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

;(function (undefined) {

  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };

  var root = (objectTypes[typeof window] && window) || this,
    freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports,
    freeModule = objectTypes[typeof module] && module && !module.nodeType && module,
    moduleExports = freeModule && freeModule.exports === freeExports && freeExports,
    freeGlobal = objectTypes[typeof global] && global;
  
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
  }

  var Ix = { 
      internals: {}, 
      config: {
        Promise: root.Promise // Detect if promise exists
      },
      helpers: { }
  };
    
  // Defaults
  var noop = Ix.helpers.noop = function () { },
    identity = Ix.helpers.identity = function (x) { return x; },
    pluck = Ix.helpers.pluck = function (property) { return function (x) { return x[property]; }; },
    just = Ix.helpers.just = function (value) { return function () { return value; }; },
    defaultComparer = Ix.helpers.defaultEqualityComparer = function (x, y) { return isEqual(x, y); },
    defaultSubComparer = Ix.helpers.defaultComparer = function (x, y) { return x > y ? 1 : (x < y ? -1 : 0); },
    defaultError = Ix.helpers.defaultError = function (err) { throw err; },
    isPromise = Ix.helpers.isPromise = function (p) { return !!p && typeof p.then === 'function'; },
    isFunction = Ix.helpers.isFunction = function (f) { return Object.prototype.toString.call(f) === '[object Function]' && typeof f === 'function'; }
    not = Ix.helpers.not = function (a) { return !a; };

  // Errors
  var sequenceContainsNoElements = 'Sequence contains no elements.';
  var argumentOutOfRange = 'Argument out of range';
  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
    arrayClass = '[object Array]',
    boolClass = '[object Boolean]',
    dateClass = '[object Date]',
    errorClass = '[object Error]',
    funcClass = '[object Function]',
    numberClass = '[object Number]',
    objectClass = '[object Object]',
    regexpClass = '[object RegExp]',
    stringClass = '[object String]';

  var toString = Object.prototype.toString,
    hasOwnProperty = Object.prototype.hasOwnProperty,  
    supportsArgsClass = toString.call(arguments) == argsClass, // For less <IE9 && FF<4
    suportNodeClass,
    errorProto = Error.prototype,
    objectProto = Object.prototype,
    propertyIsEnumerable = objectProto.propertyIsEnumerable;

  try {
    suportNodeClass = !(toString.call(document) == objectClass && !({ 'toString': 0 } + ''));
  } catch(e) {
    suportNodeClass = true;
  }

  var shadowedProps = [
    'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'
  ];

  var nonEnumProps = {};
  nonEnumProps[arrayClass] = nonEnumProps[dateClass] = nonEnumProps[numberClass] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
  nonEnumProps[boolClass] = nonEnumProps[stringClass] = { 'constructor': true, 'toString': true, 'valueOf': true };
  nonEnumProps[errorClass] = nonEnumProps[funcClass] = nonEnumProps[regexpClass] = { 'constructor': true, 'toString': true };
  nonEnumProps[objectClass] = { 'constructor': true };

  var support = {};
  (function () {
    var ctor = function() { this.x = 1; },
      props = [];

    ctor.prototype = { 'valueOf': 1, 'y': 1 };
    for (var key in new ctor) { props.push(key); }      
    for (key in arguments) { }

    // Detect if `name` or `message` properties of `Error.prototype` are enumerable by default.
    support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') || propertyIsEnumerable.call(errorProto, 'name');

    // Detect if `prototype` properties are enumerable by default.
    support.enumPrototypes = propertyIsEnumerable.call(ctor, 'prototype');

    // Detect if `arguments` object indexes are non-enumerable
    support.nonEnumArgs = key != 0;

    // Detect if properties shadowing those on `Object.prototype` are non-enumerable.
    support.nonEnumShadows = !/valueOf/.test(props);
  }(1));

  function isObject(value) {
    // check if the value is the ECMAScript language type of Object
    // http://es5.github.io/#x8
    // and avoid a V8 bug
    // https://code.google.com/p/v8/issues/detail?id=2291
    var type = typeof value;
    return value && (type == 'function' || type == 'object') || false;
  }

  function keysIn(object) {
    var result = [];
    if (!isObject(object)) {
      return result;
    }
    if (support.nonEnumArgs && object.length && isArguments(object)) {
      object = slice.call(object);
    }
    var skipProto = support.enumPrototypes && typeof object == 'function',
        skipErrorProps = support.enumErrorProps && (object === errorProto || object instanceof Error);

    for (var key in object) {
      if (!(skipProto && key == 'prototype') &&
          !(skipErrorProps && (key == 'message' || key == 'name'))) {
        result.push(key);
      }
    }

    if (support.nonEnumShadows && object !== objectProto) {
      var ctor = object.constructor,
          index = -1,
          length = shadowedProps.length;

      if (object === (ctor && ctor.prototype)) {
        var className = object === stringProto ? stringClass : object === errorProto ? errorClass : toString.call(object),
            nonEnum = nonEnumProps[className];
      }
      while (++index < length) {
        key = shadowedProps[index];
        if (!(nonEnum && nonEnum[key]) && hasOwnProperty.call(object, key)) {
          result.push(key);
        }
      }
    }
    return result;
  }

  function internalFor(object, callback, keysFunc) {
    var index = -1,
      props = keysFunc(object),
      length = props.length;

    while (++index < length) {
      var key = props[index];
      if (callback(object[key], key, object) === false) {
        break;
      }
    }
    return object;
  }   

  function internalForIn(object, callback) {
    return internalFor(object, callback, keysIn);
  }

  function isNode(value) {
    // IE < 9 presents DOM nodes as `Object` objects except they have `toString`
    // methods that are `typeof` "string" and still can coerce nodes to strings
    return typeof value.toString != 'function' && typeof (value + '') == 'string';
  }

  function isArguments(value) {
    return (value && typeof value == 'object') ? toString.call(value) == argsClass : false;
  }

  // fallback for browsers that can't detect `arguments` objects by [[Class]]
  if (!supportsArgsClass) {
    isArguments = function(value) {
      return (value && typeof value == 'object') ? hasOwnProperty.call(value, 'callee') : false;
    };
  }

  function isFunction(value) {
    return typeof value == 'function' || false;
  }

  // fallback for older versions of Chrome and Safari
  if (isFunction(/x/)) {
    isFunction = function(value) {
      return typeof value == 'function' && toString.call(value) == funcClass;
    };
  }        

  var isEqual = Ix.internals.isEqual = function (x, y) {
    return deepEquals(x, y, [], []); 
  };

  /** @private
   * Used for deep comparison
   **/
  function deepEquals(a, b, stackA, stackB) {
    // exit early for identical values
    if (a === b) {
      // treat `+0` vs. `-0` as not equal
      return a !== 0 || (1 / a == 1 / b);
    }

    var type = typeof a,
        otherType = typeof b;

    // exit early for unlike primitive values
    if (a === a && (a == null || b == null ||
        (type != 'function' && type != 'object' && otherType != 'function' && otherType != 'object'))) {
      return false;
    }

    // compare [[Class]] names
    var className = toString.call(a),
        otherClass = toString.call(b);

    if (className == argsClass) {
      className = objectClass;
    }
    if (otherClass == argsClass) {
      otherClass = objectClass;
    }
    if (className != otherClass) {
      return false;
    }
    switch (className) {
      case boolClass:
      case dateClass:
        // coerce dates and booleans to numbers, dates to milliseconds and booleans
        // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
        return +a == +b;

      case numberClass:
        // treat `NaN` vs. `NaN` as equal
        return (a != +a)
          ? b != +b
          // but treat `-0` vs. `+0` as not equal
          : (a == 0 ? (1 / a == 1 / b) : a == +b);

      case regexpClass:
      case stringClass:
        // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
        // treat string primitives and their corresponding object instances as equal
        return a == String(b);
    }
    var isArr = className == arrayClass;
    if (!isArr) {

      // exit for functions and DOM nodes
      if (className != objectClass || (!support.nodeClass && (isNode(a) || isNode(b)))) {
        return false;
      }
      // in older versions of Opera, `arguments` objects have `Array` constructors
      var ctorA = !support.argsObject && isArguments(a) ? Object : a.constructor,
          ctorB = !support.argsObject && isArguments(b) ? Object : b.constructor;

      // non `Object` object instances with different constructors are not equal
      if (ctorA != ctorB &&
            !(hasOwnProperty.call(a, 'constructor') && hasOwnProperty.call(b, 'constructor')) &&
            !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
            ('constructor' in a && 'constructor' in b)
          ) {
        return false;
      }
    }
    // assume cyclic structures are equal
    // the algorithm for detecting cyclic structures is adapted from ES 5.1
    // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
    var initedStack = !stackA;
    stackA || (stackA = []);
    stackB || (stackB = []);

    var length = stackA.length;
    while (length--) {
      if (stackA[length] == a) {
        return stackB[length] == b;
      }
    }
    var size = 0;
    result = true;

    // add `a` and `b` to the stack of traversed objects
    stackA.push(a);
    stackB.push(b);

    // recursively compare objects and arrays (susceptible to call stack limits)
    if (isArr) {
      // compare lengths to determine if a deep comparison is necessary
      length = a.length;
      size = b.length;
      result = size == length;

      if (result) {
        // deep compare the contents, ignoring non-numeric properties
        while (size--) {
          var index = length,
              value = b[size];

          if (!(result = deepEquals(a[size], value, stackA, stackB))) {
            break;
          }
        }
      }
    }
    else {
      // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
      // which, in this case, is more costly
      internalForIn(b, function(value, key, b) {
        if (hasOwnProperty.call(b, key)) {
          // count the number of properties.
          size++;
          // deep compare each property value.
          return (result = hasOwnProperty.call(a, key) && deepEquals(a[key], value, stackA, stackB));
        }
      });

      if (result) {
        // ensure both objects have the same number of properties
        internalForIn(a, function(value, key, a) {
          if (hasOwnProperty.call(a, key)) {
            // `size` will be `-1` if `a` has more properties than `b`
            return (result = --size > -1);
          }
        });
      }
    }
    stackA.pop();
    stackB.pop();

    return result;
  }
  // Shim in iterator support
  var $iterator$ = (typeof Symbol === 'function' && Symbol.iterator) ||
    '_es6shim_iterator_';
  // Bug for mozilla version
  if (root.Set && typeof new root.Set()['@@iterator'] === 'function') {
    $iterator$ = '@@iterator';
  }

  Ix.iterator = $iterator$;

  var doneEnumerator = { done: true, value: undefined };

  var Enumerator = Ix.Enumerator = function (next) {
    this._next = next;
  };

  Enumerator.prototype.next = function () {
    return this._next();
  };

  Enumerator.prototype[$iterator$] = function () { return this; }

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

  /**
   * Returns an empty Enumerable.
   * @returns {Enumerable} An empty Enumerable
   */  
  Enumerable.empty = function () {
    return new Enumerable(function () {
      return new Enumerator(function () {
        return doneEnumerator;
      });
    });
  };
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
  /** 
   * Generates a sequence of integral numbers within a specified range.
   *
   * @param {Number} start The value of the first integer in the sequence.
   * @param {Number} count The number of sequential integers to generate.
   * @returns {Enumerable} An Enumerable that contains a range of sequential integral numbers.
   */  
  Enumerable.range = function (start, count) {
    return new Enumerable(function () {
      var current = start - 1, end = start + count - 1;
      return new Enumerator(function () {
        return current++ < end ?
          { done : false, value: current } :
          doneEnumerator;
      });
    });
  };

  Enumerable.repeat = function (value, repeatCount) {
    if (repeatCount < 0) { throw new Error('repeatCount must be greater than zero'); }
    return new Enumerable(function () {
      var left = +repeatCount || 0;
      return new Enumerator(function () {
        if (left === 0) { return doneEnumerator; }
        if (left > 0) { left--; }
        return { done: false, value: value };
      });
    });
  };
    /** 
   * Computes the average of a sequence of values that are obtained by invoking a transform function on each element of the input sequence.
   * @param {Function} [selector] An optional transform function to apply to each element.
   *  selector is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      enumerable - The Enumerable object being traversed  
   * @param {Any} [thisArg] An optional scope for the selector.       
   * @returns {Number} The average of the sequence of values.
   */
  enumerableProto.average = function(selector, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    if (selector && !isFunction(selector)) {
      throw new TypeError();
    } 
    if (selector && isFunction(selector)) {
      return this.map(selector, thisArg).average();
    }
    var iterator = this[$iterator$](), count = 0, sum = 0;
    while (1) {
      var next = iterator.next();
      if (next.done) { 
        if (count === 0) {
          throw new TypeError(sequenceContainsNoElements);
        }
        return sum / count;
      }
      count++;
      sum += +next.value;
    }
  };
  /**
   * Returns a number that represents how many elements in the specified sequence satisfy a condition if specified, else the number of items in the sequence.
   *
   * @example
   * sequence.count();
   * sequence.count(function (item, index, seq) { return item % 2 === 0; });
   *
   * @param {Function} [predicate] A function to test each element for a condition, taking three arguments:
   *    currentValue - The current element being processed in the Enumerable.
   *    index - The index of the current element being processed in the Enumerable.
   *    enumerable - The Enumerable some was called upon.   
   * @returns {Number} A number that represents how many elements in the sequence satisfy the condition in the predicate function if specified, else number of items in the sequence.
   */  
  enumerableProto.count = function (predicate, thisArg) {
    if (predicate && !isFunction(predicate)) {
      throw new TypeError('predicate must be a function');
    }
    return predicate ?
      this.filter(predicate, thisArg).count() :
      this.reduce(function (acc) { return acc + 1; }, 0);
  };

  /**
   * The every() method tests whether all elements in the Enumerable pass the test implemented by the provided function.
   * @param {Function} callback Function to test for each element, taking three arguments:
   *    currentValue - The current element being processed in the Enumerable.
   *    index - The index of the current element being processed in the Enumerable.
   *    enumerable - The Enumerable some was called upon.
   * @param {Any} [thisArg] Value to use as this when executing callback.
   * @returns {Boolean} true if all elements in the Enumerable passes the test; else false.
   */
  enumerableProto.every = function (callback, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    if (!isFunction(callback)) {
      throw new TypeError();
    }
    var iterator = this[$iterator$](), i = 0;
    while (1) {
      var next = iterator.next();
      if (next.done) { return true; }
      if (!callback.call(thisArg, next.value, i++, this)) { return false; }
    }    
  };

  /**
   * The find() method returns a value in the Enumerable, if an element in the Enumerable satisfies the provided testing function. Otherwise undefined is returned.
   * @param {Function} predicate 
   *  predicate is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      enumerable - The Enumerable object being traversed
   * @param {Any} thisArg Object to use as this when executing callback.
   * @returns {Any} The item that satisfies the predicate, else undefined.
   */
  enumerableProto.find = function (predicate, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    if (!isFunction(predicate)) {
      throw new TypeError();
    }    
    var index = 0,
        iterable = this[$iterator$]();
    while (1) {
      var next = iterable.next();
      if (next.done) { return undefined; }
      if (predicate.call(thisArg, next.value, index, this)) { return next.value;  }
      index++;
    }
  };

  /**
   *The findIndex() method returns an index in the Enumerable, if an element in the Enumerable satisfies the provided testing function. Otherwise -1 is returned.
   * @param {Function} predicate 
   *  predicate is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      enumerable - The Enumerable object being traversed
   * @param {Any} thisArg Object to use as this when executing callback.
   * @returns {Any} The index of the item that satisfies the predicate, else -1.
   */
  enumerableProto.findIndex = function (predicate, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    if (!isFunction(predicate)) {
      throw new TypeError();
    }     
    var index = 0,
        iterable = this[$iterator$]();
    while (1) {
      var next = iterable.next();
      if (next.done) { return -1; }
      if (predicate.call(thisArg, next.value, index, this)) { return index;  }
      index++;
    }
  };

  /**
   * Performs the specified action on each element of the Enumerable sequence
   *
   * @example
   * sequence.forEach(function (item, index, seq) { console.log(item); });
   *
   * @param {Function} callback Function to execute for each element, taking three arguments:
   *      currentValue - The current element being processed in the Enumerable.
   *      index - The index of the current element being processed in the Enumerable.
   *      enumerable - The Enumerable forEach was called upon.
   * @param {Any} [thisArg] Value to use as this when executing callback.
   */  
  enumerableProto.forEach = function (callback, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    if (!isFunction(callback)) {
      throw new TypeError();
    }
    var index = 0,
        iterable = this[$iterator$]();
    while (1) {
      var next = iterable.next();
      if (next.done) { return; }
      callback.call(thisArg, next.value, index++, this);
    }
  };

  function reduce (source, func, seed) {
    var accumulate = seed, iterator = source[$iterator$](), i = 0;
    while (1) {
      var next = iterator.next();
      if (next.done) { return accumulate; }
      accumulate = func(accumulate, next.value, i++, source);
    }      
  }

  function reduce1 (source, func) {
    var iterator = source[$iterator$](), i = 0, next = iterator.next();
    if (next.done) {
      throw new TypeError(sequenceContainsNoElements);
    }
    var accumulate = next.value;

    while (1) {
      var next = iterator.next();
      if (next.done) { return accumulate; }
      accumulate = func(accumulate, next.value, i++, source);
    }
  }

  /**
   * The reduce() method applies a function against an accumulator and each value of the Enumerable (from left-to-right) has to reduce it to a single value.S
   * @param {Function} callback Function to execute on each value in the Enumerable, taking four arguments:
   *      previousValue - The value previously returned in the last invocation of the callback, or initialValue, if supplied.
   *      currentValue - The current element being processed in the Enumerable.
   *      index - The index of the current element being processed in the Enumerable.
   *      enumerable - The Enumerable forEach was called upon.
   * @param {Any} [thisArg] Value to use as this when executing callback.
   * @returns {Any} The value produced by the accumulator on all values and the initial value, if supplied. 
   */  
  enumerableProto.reduce = function (/*callback, initialValue*/) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    var fn = arguments[0];
    if (!isFunction(fn)) {
      throw new TypeError();
    }        
    return arguments.length === 2 ?
      reduce(this, fn, arguments[1]) :
      reduce1(this, fn);
  };

  /**
   * The some() method tests whether some element in the Enumerable passes the test implemented by the provided function.
   * @param {Function} callback Function to test for each element, taking three arguments:
   *    currentValue - The current element being processed in the Enumerable.
   *    index - The index of the current element being processed in the Enumerable.
   *    enumerable - The Enumerable some was called upon.
   * @param {Any} [thisArg] Value to use as this when executing callback.
   * @returns {Boolean} true if some element in the Enumerable passes the test; else false.
   */
  enumerableProto.some = function (callback, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    if (!isFunction(callback)) {
      throw new TypeError();
    }
    var iterator = this[$iterator$](), i = 0;
    while (1) {
      var next = iterator.next();
      if (next.done) { return false; }
      if (callback.call(thisArg, next.value, i++, this)) { return true; }
    }    
  };

  /**
   * Computes the sum of the sequence of values that are optionally obtained by invoking a transform function on each element of the input sequence.
   * 
   * @example
   *  res = source.sum();
   *  res = source.sum(function (x) { return x.value; });
   *
   * @param {Function} [selector] A transform function to apply to each element.
   * @returns {Any} The sum of the values.
   */  
  enumerableProto.sum = function (selector) {
    if (!isFunction(selector)) {
      throw new TypeError('selector must be a function');
    }
    return selector ?
      this.map(selector).sum() :
      this.reduce(function (acc, x) { return acc + x; });
  };

  /**
   * Projects each element of a sequence to an Enumerable, flattens the resulting sequences into one sequence, and invokes a result selector function on each element therein. The index of each source element is used in the intermediate projected form of that element.
   * 
   * @example
   *   seq.flatMap(new Set([1,2,3,4]))
   *   seq.flatMap(selector);
   *   seq.flatMap(collectionSelector, resultSelector);
   *
   * @param {Function} collectionSelector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
   * @param {Function} [resultSelector] An optional transform function to apply to each element of the intermediate sequence.
   * @returns {Enumerable} An Enumerable whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of source and then mapping each of those sequence elements and their corresponding source element to a result element.
   */  
  enumerableProto.flatMap = function (collectionSelector, resultSelector) {
    typeof collectionSelector !== 'function' && (collectionSelector = function () { return collectionSelector; });
    if (resultSelector && !isFunction(resultSelector)) {
      throw new TypeError('resultSelector must be a function');
    }

    var parent = this;
    return new Enumerable(function () {
      var index = 0, outerIterator, innerIterator;
      return new Enumerator(function () {
        outerIterator || (outerIterator = parent[$iterator$]);
        var outerNext;
        while(1) {
          if (!innerIterator) {
            outerNext = outerIterator.next();
            if (outerNext.done) {
              return doneEnumerator;
            }

            innerIterator = collectionSelector(outerNext.value, index++, parent)[$iterator$];
          }

          var innerNext = innerIterator.next();
          if (innerNext.done) {
            innerIterator = null;
          } else {
            var current = innerNext.value;
            if (resultSelector) {
              current = resultSelector(outerNext.value, current);
            }
            return { done: false, value: current };
          }          
        }
      });
    });
  };

  /**
   * Projects each element of a sequence into a new form by incorporating the element's index.
   * 
   * @param {Function} selector A transform function to apply to each source element.
   *  selector is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      enumerable - The Enumerable object being traversed   
   * @param {Any} [thisArg] An optional scope for the selector.
   * @returns {Enumerable} An Enumerable whose elements are the result of invoking the transform function on each element of source.
   */  
  enumerableProto.map = function (selector, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    if (!isFunction(selector)) {
      throw new TypeError();
    }
    var self = this;   
    return new Enumerable(function () {
      var index = 0, iterator;
      return new Enumerator(function () {
        iterator || (iterator = self[$iterator$]());
        var next = iterator.next();
        return next.done ?
          doneEnumerator :
          { done: false, value: selector.call(thisArg, next.value, index++, self) };
      });
    });
  };

  /**
   * Creates a new Enumerable with all elements that pass the test implemented by the provided function.
   *
   * @param {Function} predicate 
   *  predicate is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      enumerable - The Enumerable object being traversed
   * @param {Any} [thisArg] Object to use as this when executing predicate.
   * @returns {Enumerable} An Enumerable that contains elements from the input sequence that satisfy the condition.
   */  
  enumerableProto.filter = function (predicate, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    if (!isFunction(predicate)) {
      throw new TypeError();
    } 
    var self = this;     
    return new Enumerable(function () {
      var index = 0, iterator;
      return new Enumerator(function () {
        iterator || (iterator = self[$iterator$]());
        while (1) {
          var next = iterator.next();
          if (next.done) { return doneEnumerator; }
          if (predicate.call(thisArg, next.value, index++, self)) {
            return { done: false, value: next.value };
          }     
        }
      });
    });
  };

  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    root.Ix = Ix;

    define(function() {
      return Ix;
    });
  } else if (freeExports && freeModule) {
    // in Node.js or RingoJS
    if (moduleExports) {
      (freeModule.exports = Ix).Ix = Ix;
    } else {
    freeExports.Ix = Ix;
    }
  } else {
    // in a browser or Rhino
    root.Ix = Ix;
  }
}(this));