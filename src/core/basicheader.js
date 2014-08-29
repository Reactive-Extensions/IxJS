  // Defaults
  var noop = Ix.helpers.noop = function () { },
    identity = Ix.helpers.identity = function (x) { return x; },
    pluck = Ix.helpers.pluck = function (property) { return function (x) { return x[property]; }; },
    just = Ix.helpers.just = function (value) { return function () { return value; }; },
    defaultComparer = Ix.helpers.defaultEqualityComparer = function (x, y) { return isEqual(x, y); },
    defaultSubComparer = Ix.helpers.defaultComparer = function (x, y) { return x > y ? 1 : (x < y ? -1 : 0); },
    defaultError = Ix.helpers.defaultError = function (err) { throw err; },
    isPromise = Ix.helpers.isPromise = function (p) { return !!p && typeof p.then === 'function'; },
    isFunction = Ix.helpers.isFunction = function (f) { return Object.prototype.toString.call(f) === '[object Function]' && typeof f === 'funciton'; }
    not = Ix.helpers.not = function (a) { return !a; };

  // Errors
  var sequenceContainsNoElements = 'Sequence contains no elements.';
  var argumentOutOfRange = 'Argument out of range';