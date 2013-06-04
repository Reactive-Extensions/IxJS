    var Lookup = (function () {

        function Lookup(map) {
            this.map = map;
        }

        var LookupPrototype = Lookup.prototype;

        LookupPrototype.has = function (key) {
            return map.containsKey(key);
        };

        LookupPrototype.length = function () {
            return map.length();
        };

        LookupPrototype.get = function (key) {
            return enumerableFromArray(map.get(key));
        };

        LookupPrototype.toEnumerable = function () {
            return map.toEnumerable().select(function (kvp) {
                var e = enumerableFromArray(kvp.value);
                e.key = kvp.key;
                return e;
            });
        };

        return Lookup;
    }());
