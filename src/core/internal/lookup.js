    var Lookup = Ix.Internals.Lookup = (function () {

        function Lookup(map) {
            this.map = map;
        }

        var LookupPrototype = Lookup.prototype;

        LookupPrototype.has = function (key) {
            return this.map.has(key);
        };

        LookupPrototype.length = function () {
            return this.map.length();
        };

        LookupPrototype.get = function (key) {
            return enumerableFromArray(this.map.get(key));
        };

        LookupPrototype.toEnumerable = function () {
            return this.map.toEnumerable().select(function (kvp) {
                var e = enumerableFromArray(kvp.value);
                e.key = kvp.key;
                return e;
            });
        };

        return Lookup;
    }());
