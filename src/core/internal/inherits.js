    var hasProp = {}.hasOwnProperty;

    /** @private */
    var inherits = this.inherits = Ix.Internals.inherits = function (child, parent) {
        function __() { this.constructor = child; }
        __.prototype = parent.prototype;
        child.prototype = new __();
    };

    /** @private */    
    var addProperties = Ix.Internals.addProperties = function (obj) {
        var sources = slice.call(arguments, 1);
        for (var i = 0, len = sources.length; i < len; i++) {
            var source = sources[i];
            for (var prop in source) {
                obj[prop] = source[prop];
            }
        }
    };