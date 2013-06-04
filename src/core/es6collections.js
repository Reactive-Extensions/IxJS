    function arrayIndexOf (arr, value, comparer) {
        comparer || (comparer = defaultEqualityComparer);
        for (var i  = 0, len = arr.length; i < len; i++) {
            if (comparer(arr[i], value)) { return i; }
        }
        return -1;
    }

    var InternalMap = (function () {
        function InternalMap (comparer) {
            this.comparer = comparer || defaultEqualityComparer;
            this.keys = [];
            this.values = [];
            this.length = 0;
        }

        var InternalMapPrototype = InternalMap.prototype;
        InternalMapPrototype.get = function (key) {
            var idx = arrayIndexOf(this.keys, key, this.comparer);
            return idx !== -1 ? this.values[idx] : undefined;
        };

        InternalMapPrototype.set = function (key, value) {
            var idx = arrayIndexOf(this.keys, key, this.comparer);
            if (idx === -1) {
                this.keys.push(key);
                this.values.push(value);
                this.length++;
            } else {
                this.values[idx] = value;
            }
        };

        InternalMapPrototype.has = function (key) {
            return arrayIndexOf(this.keys, key, this.comparer) !== -1; 
        };

        InternalMapPrototype['delete'] = function (key) {
            var i = arrayIndexOf(this.keys, key, this.comparer);
            if (i !== -1) {
                this.keys.splice(i, 1);
                this.values.splice(i, 1);
                this.length--;
            } 
        };

        return InternalMap; 
    }());

    var Lookup = (function () {
        function Lookup(map) {
            this.map = map;
        }

        var LookupPrototype = Lookup.prototype;

        LookupPrototype.has = function (key) {
            return map.has(key);
        };

        LookupPrototype.count = function () {
            return map.length;
        };

        LookupPrototype.get = function (key) {

        };

        return Lookup;
    }());
