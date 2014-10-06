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
