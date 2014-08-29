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