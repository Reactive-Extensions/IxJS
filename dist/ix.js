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
    
  // Constants
  var maxSafeInteger = Math.pow(2, 53) - 1;

  // Defaults
  var noop = Ix.helpers.noop = function () { },
    identity = Ix.helpers.identity = function (x) { return x; },
    pluck = Ix.helpers.pluck = function (property) { return function (x) { return x[property]; }; },
    just = Ix.helpers.just = function (value) { return function () { return value; }; },
    defaultComparer = Ix.helpers.isEqual = function (x, y) { return isEqual(x, y); },
    defaultSubComparer = Ix.helpers.defaultComparer = function (x, y) { return x > y ? 1 : (x < y ? -1 : 0); },
    defaultError = Ix.helpers.defaultError = function (err) { throw err; },
    isPromise = Ix.helpers.isPromise = function (p) { return !!p && typeof p.then === 'function'; },
    isFunction = Ix.helpers.isFunction = function (f) { return Object.prototype.toString.call(f) === '[object Function]' && typeof f === 'function'; }
    not = Ix.helpers.not = function (a) { return !a; },
    isIterable = Ix.helpers.isIterable = function(x) { return x != null && Object(x) === x && typeof x[$iterator$] !== 'undefined'; },
    toInteger = Ix.helpers.toInteger = function(value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    },
    toLength = Ix.helpers.toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

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

  /**
   * Returns an empty Enumerable.
   * @returns {Enumerable} An empty Enumerable
   */  
  Enumerable.empty = function () {
    return new Enumerable(function () {
      return new Enumerator(function () {
        return doneIterator;
      });
    });
  };

  /**
   * The Enumerable.from() method creates a new Enumerable instance from an array-like or iterable object.
   * @param {Any} arrayLike An array-like or iterable object to convert to an Enumerable.
   * @param {Function} [mapFn] Map function to call on every element of the array.
   *  selector is invoked with two arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   * @param {Any} [thisArg] Value to use as this when executing mapFn.
   * @returns {Enumerable} an Enumerable created from the array-like or iterable object.  
   */
  var enumerableFrom = Enumerable.from = function (arrayLike, mapFn, thisArg) {
    var items = Object(arrayLike);
    if (arrayLike == null) {
      throw new TypeError('Enumerable.from requires an array like object');
    }
    if (mapFn && !isFunction(mapFn)) {
      throw new TypeError();
    }

    return new Enumerable(function () {
      var isObjIterable = isIterable(items), 
        iterator = isObjIterable ? items[$iterator$]() : null,
        result, 
        i = 0, 
        value,
        length;
      return new Enumerator(function () {
        if (isObjIterable) {
          var next = iterator.next();
          if (next.done) { return doneIterator; }
          value = next.value;
          if (mapFn) {
            value = mapFn.call(thisArg, value, i++);
          }
          return { done: false, value: value };
        } else {
          length = toLength(items.length);
          if (i < length) {
            value = items[i];
            if (mapFn) {
              value = mapFn.call(thisArg, value, i);
            }
            i++;
            return { done: false, value: value };
          } 
          return doneIterator;
        }
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
            doneIterator;
        });
    });
  };
  /** 
   * Generates a sequence of integral numbers within a specified range.
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
          doneIterator;
      });
    });
  };

  /**
   * Generates a sequence that contains one repeated value.
   * @param {Any} value The value to be repeated.
   * @param {Number} repeatCount The number of times to repeat the value in the generated sequence.
   * @returns {Enumerable} An Enumerable that contains a repeated value.
   */  
  Enumerable.repeat = function (value, repeatCount) {
    if (repeatCount < 0) { throw new Error('repeatCount must be greater than zero'); }
    return new Enumerable(function () {
      var left = +repeatCount || 0;
      Math.abs(left) === Infinity && (left = 0);
      return new Enumerator(function () {
        if (left === 0) { return doneIterator; }
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
    var it = this[$iterator$](), count = 0, sum = 0, next;
    while (!(next = it.next()).done) {
      count++;
      sum += +next.value;
    }
    if (count === 0) {
      throw new TypeError(sequenceContainsNoElements);
    }
    return sum / count;
  };

  /**
   * The contains() method determines whether an Enumerable contains a certain element, returning true or false as appropriate.
   * @param {Any} searchElement Element to locate in the Enumerable.
   * @param {Number} [fromIndex] Default: 0 (Entire Enumerable is searched)
   * @returns {Number} true if the element is found in the Enumerable, else false.
   */
  enumerableProto.contains = function (searchElement, fromIndex) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    var n = +fromIndex || 0, i = 0, it = this[$iterator$](), next;
    Math.abs(n) === Infinity && (n = 0);
    function comparer(a, b) { return (a === 0 && b === 0) || (a === b || (isNaN(a) && isNan(b))); }
    while (!(next = it.next()).done) {
      if (n >= i++ && comparer(next.value, searchElement)) { return true; }
    }
    return false;
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
   *    iterable - The Enumerable some was called upon.   
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
   * Returns the element at a specified index in a sequence.
   * @param {Number} index The zero-based index of the element to retrieve.
   * @returns {Any} The element at the specified position in the source sequence.
   */
  enumerableProto.elementAt = function (index) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    var n = +index || 0;
    Math.abs(n) === Infinity && (n = 0);
    if (n < 0) { throw new RangeError('index cannot be less than zero.'); }
    var it = this[$iterator$](), i = 0, next;
    while (!(next = it.next()).done) {
      if (i++ === index) { return next.value; }
    }
    throw new RangeError('index is greater than or equal to the number of elements in source');
  };

  /**
   * Returns the element at a specified index in a sequence or a default value if the index is out of range.
   * @param {Number} index The zero-based index of the element to retrieve.
   * @param {Any} [defaultValue] Default value if out of range. If not specified, defaults to undefined.
   * @returns {Any} The default value specified if the index is outside the bounds of the source sequence; otherwise, the element at the specified position in the source sequence.
   */
  enumerableProto.elementAtOrDefault = function (index, defaultValue) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    var n = +index || 0;
    Math.abs(n) === Infinity && (n = 0);
    if (n < 0) { throw new RangeError('index cannot be less than zero.'); }
    var it = this[$iterator$](), i = 0, next;
    while (!(next = it.next()).done) {
      if (i++ === index) { return next.value; }
    }
    return defaultValue;
  };

  /**
   * The every() method tests whether all elements in the Enumerable pass the test implemented by the provided function.
   * @param {Function} callback Function to test for each element, taking three arguments:
   *    currentValue - The current element being processed in the Enumerable.
   *    index - The index of the current element being processed in the Enumerable.
   *    iterable - The Enumerable some was called upon.
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
   * Returns the first element in a sequence that satisfies a specified condition if specified, else the first element.
   * @param {Function} [predicate] A function to test each element for a condition
   *  predicate is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      iterable - The Iterable object being traversed   
   * @param {Any} [thisArg] Object to use as this when executing predicate.
   * @returns {Any} The first element in the sequence that passes the test in the specified predicate function if specified, else the first element.
   */  
  enumerableProto.first = function (predicate, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    if (predicate && !isFunction(predicate)) {
      throw new TypeError();
    }
    var index = 0,
        iterable = this[$iterator$]();
    while (1) {
      var next = iterable.next();
      if (next.done) { throw new TypeError(sequenceContainsNoElements); }
      if (predicate && predicate.call(thisArg, next.value, index++, this)) {
        return next.value;
      }
    }
  };

  /**
   * Returns the first element in a sequence that satisfies a specified condition if specified, else the first element.
   * @param {Function} [predicate] A function to test each element for a condition
   *  predicate is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      iterable - The Iterable object being traversed
   * @param {Any} [thisArg] Object to use as this when executing predicate.
   * @returns {Any} The first element in the sequence that passes the test in the specified predicate function if specified, else the first element.
   */  
  enumerableProto.firstOrDefault = function (predicate, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    if (predicate && !isFunction(predicate)) {
      throw new TypeError();
    }
    var index = 0,
        iterable = this[$iterator$]();
    while (1) {
      var next = iterable.next();
      if (next.done) { return undefined; }
      if (predicate && predicate.call(thisArg, next.value, index++, this)) {
        return next.value;
      }
    }
  };

  /**
   * Performs the specified action on each element of the Enumerable sequence
   * @param {Function} callback Function to execute for each element, taking three arguments:
   *      currentValue - The current element being processed in the Enumerable.
   *      index - The index of the current element being processed in the Enumerable.
   *      iterable - The Enumerable forEach was called upon.
   * @param {Any} [thisArg] Value to use as this when executing callback.
   */  
  enumerableProto.forEach = function (callback, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    if (!isFunction(callback)) {
      throw new TypeError();
    }
    var i = 0, it = this[$iterator$](), next;
    while (!(next = it.next()).done) {
      callback.call(thisArg, next.value, i++, this);
    }
  };

  /**
   * The indexOf() method returns the first index at which a given element can be found in the Enumerable, or -1 if it is not present.
   * @param {Any} searchElement Element to locate in the Enumerable.
   * @param {Number} [fromIndex] Default: 0 (Entire Enumerable is searched)
   * @returns {Number} The first index at which a given element can be found in the Enumerable, or -1 if not found.
   */
  enumerableProto.indexOf = function (searchElement, fromIndex) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    var n = +fromIndex || 0, index = 0, iterator = this[$iterator$]();
    Math.abs(n) === Infinity && (n = 0);
    while (1) {
      var current = iterator.next();
      if (next.done) { return -1; }
      if (n >= index && next.value === searchElement) { return index; }
      index++;
    }
  };

  /**
   * Returns the last element of a sequence that satisfies an optional condition if specified, else the last element.
   * @param {Function} predicate 
   *  predicate is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      iterable - The Enumerable object being traversed
   * @param {Any} [thisArg] Object to use as this when executing predicate.
   * @returns {Any} The last element in the sequence that passes the test in the specified predicate function if specified, else the last element.
   */  
  enumerableProto.last = function (predicate, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    if (predicate && !isFunction(predicate)) {
      throw new TypeError();
    }
    var it = this[$iterator$](), next, i = 0, value, hasValue;
    while (!(next = it.next()).done) {
      if (!predicate || predicate.call(thisArg, next.value, i++, this)) {
        hasValue = true;
        value = next.value;
      }
    }
    if (hasValue) { return value; }
    throw new Error(sequenceContainsNoElements);
  };

  /**
   * Returns the last element of a sequence that satisfies an optioanl condition or a null if no such element is found.
   * @param {Function} predicate 
   *  predicate is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      iterable - The Enumerable object being traversed
   * @param {Any} [thisArg] Object to use as this when executing predicate.
   * @returns {Any} null if the sequence is empty or if no elements pass the test in the predicate function; otherwise, the last element that passes the test in the predicate function if specified, else the last element.
   */
  enumerableProto.lastOrDefault = function (predicate, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    if (predicate && !isFunction(predicate)) {
      throw new TypeError();
    }
    var it = this[$iterator$](), next, i = 0, value, hasValue;
    while (!(next = it.next()).done) {
      if (!predicate || predicate.call(thisArg, next.value, i++, this)) {
        hasValue = true;
        value = next.value;
      }
    }
    return hasValue ? value : undefined;
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
   *      iterable - The Enumerable forEach was called upon.
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
   * Determines whether two sequences are equal with an optional equality comparer
   * @param {Enumerable} second An Enumerable to compare to the first sequence.
   * @param {Function} [comparer] An optional function to use to compare elements.
   * @returns {Boolean} true if the two source sequences are of equal length and their corresponding elements compare equal according to comparer; otherwise, false.
   */
  enumerableProto.sequenceEqual = function (second, comparer) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    comparer || (comparer = defaultComparer);
    !isIterable(second) || (second = observableFrom(second));
    var it1 = this[$iterator$](), it2 = second[$iterator$]();
    var next1, next2;
    while (!(next1 = it1.next()).done) {
      if (!((next2 = it2.next()).done && comparer(next1.value, next2.value))) { return false; }
    }
    if (!(next2 = it2.next()).done) { return false; }
    return true;
  };
  /**
   * Returns the only element of a sequence that satisfies an optional condition, and throws an exception if more than one such element exists.
   * Or returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence.
   * @param {Function} [predicate]
   *  predicate is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      iterable - The Enumerable object being traversed
   * @param {Any} [thisArg] Object to use as this when executing predicate.   
   * @returns {Any} The single element of the input sequence that satisfies a condition if specified, else the first element.
   */
  enumerableProto.single = function (predicate, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    if (predicate && isFunction(predicate)) {
      return this.filter(predicate, thisArg).single();
    }
    var it = this[$iterator$](),
        next = it.next();
    if (next.done) {
      throw new Error(sequenceContainsNoElements);
    }
    var value = next.value;
    next = it.next();
    if (!next.done) {
      throw new Error('Sequence contains more than one element');
    }
    return value;
  };
  /**
   * Returns the only element of a sequence, or a default value if the sequence is empty; this method throws an exception if there is more than one element in the sequence.
   * Or returns the only element of a sequence that satisfies a specified condition or a default value if no such element exists; this method throws an exception if more than one element satisfies the condition
   * @param {Function} [predicate] A function to test each element for a condition
   *  predicate is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      iterable - The Enumerable object being traversed
   * @param {Any} [thisArg] Object to use as this when executing predicate.
   * @returns {Any} The single element of the input sequence that satisfies the optional condition, or undefined if no such element is found.
   */
  enumerableProto.singleOrDefault = function (predicate, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    if (predicate && !isFunction(predicate)) {
      throw new TypeError();
    }
    if (predicate) {
      return this.filter(predicate, thisArg).singleOrDefault();
    }
    var it = this[$iterator$](),
        next = it.next();
    if (next.done) { return undefined; }
    var value = next.value;
    next = it.next();
    if (!next.done) {
      throw new Error('Sequence contains more than one element');
    }
    return value;
  };   
  /**
   * The some() method tests whether some element in the Enumerable passes the test implemented by the provided function.
   * @param {Function} callback Function to test for each element, taking three arguments:
   *    currentValue - The current element being processed in the Enumerable.
   *    index - The index of the current element being processed in the Enumerable.
   *    iterable - The Enumerable some was called upon.
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
   * @param {Function} [selector] A transform function to apply to each element.
   * @returns {Any} The sum of the values.
   */  
  enumerableProto.sum = function (selector) {
    if (selector && !isFunction(selector)) {
      throw new TypeError('selector must be a function');
    }
    return selector ?
      this.map(selector).sum() :
      this.reduce(function (acc, x) { return acc + x; });
  };

  /**
   * Creates an array from an Enumerable.
   * @returns {Array} An array that contains the elements from the input sequence.
   */  
  enumerableProto.toArray = function () {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    var results = [], it = this[$iterator$](), next;
    while (!(next = it.next()).done) {
      results.push(next.value);
    }
    return results;
  };

  /**
   * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is empty.
   *
   * @param {Any} [defaultValue] The value to return if the sequence is empty.
   * @returns {Enumerable} An Enumerable that contains defaultValue if source is empty; otherwise, source.
   */  
  enumerableProto.defaultIfEmpty = function (defaultValue) {
    var source = this;
    return new Enumerable(function () {
      var it, hasValue = false, hasSent = false;
      return new Enumerator(function () {
        it || (it = source[$iterator$]());
        while (1) {
          var next = it.next();
          if (next.done) {
            if (!hasValue && !hasSent) {
              hasSent = true;
              return { value: defaultValue, done: false };
            }
            return doneIterator;
          } 
          hasValue = true;
          return { value: next.value, done: false };
        }
      });
    });
  };

  /**
   * Returns distinct elements from a sequence.
   * @returns {Observable} The distinct values from a sequence.
   */
  enumerableProto.distinct = function () {
    var source = this;
    return new Enumerable(function () {
      var it, map = [];
      return new Enumerator(function () {
        while (1) {
          var next = it.next();
          if (next.done) { return doneIterator; }
          if (!map.indexOf(next.value)) {
            map.push(next.value);
            return { value: next.value, done: false };
          }
        }
      });
    });
  };

  /**
   * Produces the set difference of two sequences by using the specified comparer function to compare values.
   * @param {Any} other An Enumerable whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @returns {Enumerable} A sequence that contains the set difference of the elements of two sequences.
   */
  enumerableProto.except = function (other) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    var source = this;
    return new Enumerable(function () {
      Array.isArray(other) && (other = Enumerable.from(other));
      var otherMap = [], otherIt = other[$iterator$](), otherNext;
      do {
        otherNext = otherIt.next();
        otherNext.done || otherMap.push(otherNext.value);
      } while (!other.done);

      var it;
      return new Enumerator(function () {
        it || (it = source[$iterator$]());
        while (1) {
          var next = it.next();
          if (next.done) { return doneIterator; }
          if (otherMap.indexOf(next.value) === -1) {
            otherMap.push(next.value);
            return { done: false, value: next.value };
          }
        }
      });
    });
  };

  /**
   * Creates a new Enumerable with all elements that pass the test implemented by the provided function.
   * @param {Function} predicate 
   *  predicate is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      iterable - The Enumerable object being traversed
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
    var source = this;     
    return new Enumerable(function () {
      var i = 0, it = source[$iterator$]();
      return new Enumerator(function () {
        var next;
        while (!(next = it.next()).done) {
          if (predicate.call(thisArg, next.value, i++, source)) {
            return { done: false, value: next.value };
          }
        }
        return doneIterator;
      });
    });
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
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    typeof collectionSelector !== 'function' && (collectionSelector = function () { return collectionSelector; });
    if (resultSelector && !isFunction(resultSelector)) {
      throw new TypeError('resultSelector must be a function');
    }

    var source = this;
    return new Enumerable(function () {
      var index = 0, outerIterator = source[$iterator$](), innerIterator;
      return new Enumerator(function () {
        var outerNext;
        while(1) {
          if (!innerIterator) {
            outerNext = outerIterator.next();
            if (outerNext.done) {
              return doneIterator;
            }

            var innerItem = collectionSelector(outerNext.value, index++, source);
            !isIterable(innerItem) || (innerItem = enumerableFrom(innerItem));
            innerIterator = innerItem[$iterator$]();
          }

          var innerNext = innerIterator.next();
          if (innerNext.done) {
            innerIterator = null;
          } else {
            var current = innerNext.value;
            resulSelector && (current = resulSelector(outerNext.value, current));
            return { done: false, value: current };
          }          
        }
      });
    });
  };

  /**
   * Projects each element of a sequence into a new form by incorporating the element's index.
   * 
   * @param {Function} callback A transform function to apply to each source element.
   *  callback is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      iterable - The Enumerable object being traversed   
   * @param {Any} [thisArg] An optional scope for the callback.
   * @returns {Enumerable} An Enumerable whose elements are the result of invoking the transform function on each element of source.
   */  
  enumerableProto.map = function (callback, thisArg) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    if (!isFunction(callback)) {
      throw new TypeError();
    }
    var source = this;   
    return new Enumerable(function () {
      var index = 0, iterator = source[$iterator$]();
      return new Enumerator(function () {
        var next = iterator.next();
        return next.done ?
          doneIterator :
          { done: false, value: callback.call(thisArg, next.value, index++, source) };
      });
    });
  };

  /** 
   * Inverts the order of the elements in a sequence.
   * @returns {Enumerable} A sequence whose elements correspond to those of the input sequence in reverse order.
   */
  enumerableProto.reverse = function () {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    var source = this;
    return new Enumerable(function () {
      var it = source[$iterator$](), arr = [], next;
      while (!(next = it.next()).done) {
        arr.unshift(next.value);
      }
      var len = arr.length, i = 0;
      return new Enumerator(function () {
        if (i < len) {
          var value = arr[i++];
          return { done: false, value: value };
        }
        return doneIterator;
      });
    });
  };
  /** 
   * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
   * @param {Number} count The number of elements to skip before returning the remaining element
   * @returns {Enumerable} An Enumerable that contains the elements that occur after the specified index in the input sequence.
   */
  enumerableProto.skip = function (count) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    +count || (count = 0);
    Math.abs(count) === Infinity && (count = 0);
    if (count < 0) { throw new RangeError(); }
    var source = this; 
    return new Enumerable(function () {
      var skipped = false, it = source[$iterator$]();
      return new Enumerator(function () {
        var next;
        if (!skipped) {
          for (var i = 0; i < count; i++) {
            next = it.next();
            if (next.done) { return doneIterator; }
          }
          skipped = true;
        }
        next = it.next();
        if (next.done) { return doneIterator; }
        return { done: false, value: next.value };
      });
    });
  };
  /**
   * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements. The element's index is used in the logic of the predicate function.
   * @param {Function} callback 
   *  callback is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      iterable - The Enumerable object being traversed
   * @param {Any} [thisArg] Object to use as this when executing callback.
   * @returns {Enumerable} An Enumerable that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.
   */
  enumerableProto.skipWhile = function (callback, thisArg) {
    var source = this;
    return new Enumerable(function () {
      var skipped = false, i = 0, it = source[$iterator$]();
      return new Enumerator(function () {
        var next;
        if (!skipped) {
          while(1) {
            next = it.next();
            if (next.done) { return doneIterator; }
            if (!callback.call(thisArg, next.value, i++, source)) {
              return { done: false, value: next.value };
            }
            skipped = true;
          }
        }
        next = it.next();
        if (next.done) { return doneIterator; }
        return { done: false, value: next.value };
      });
    });
  };
  /** 
   * Returns a specified number of contiguous elements from the start of a sequence.
   * @param {Number} count The number of elements to return.
   * @returns {Enumerable} An Enumerable that contains the specified number of elements from the start of the input sequence.
   */
  enumerableProto.take = function (count) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    +count || (count = 0);
    Math.abs(count) === Infinity && (count = 0);
    if (count < 0) { throw new RangeError(); }
    var source = this;
    return new Enumerable(function () {
      var i = count, it = source[$iterator$]();
      return new Enumerator(function () {
        var next = it.next();
        if (next.done) { return doneIterator; }
        if (i-- === 0) { return doneIterator; }
        return { value: next.value, done: false };
      });
    });
  };

  /**
   * Returns elements from a sequence as long as a specified condition is true. The element's index is used in the logic of the callback function.
   * @param {Function} callback 
   *  callback is invoked with three arguments: 
   *      currentValue - The value of the element
   *      index - The index of the element
   *      iterable - The Enumerable object being traversed
   * @param {Any} [thisArg] Object to use as this when executing callback.
   * @returns {Enumerable} An Enumerable that contains elements from the input sequence that occur before the element at which the test no longer passes.
   */
  enumerableProto.takeWhile = function (callback, thisArg) {
    var source = this;
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }    
    if (!isFunction(callback)) {
      throw new TypeError();
    }    
    return new Enumerable(function () {
      var i = 0, it = source[$iterator$]();
      return new Enumerator(function () {
        var next = it.next();
        if (next.done) { return doneIterator; }
        if (!callback.call(thisArg, next.value, i++, source)) { return doneIterator; }
        return { done: false, value: next.done };
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