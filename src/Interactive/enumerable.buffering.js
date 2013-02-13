
    var SharedBuffer = (function () {
        inherits(Enumerable, SharedBuffer);

        function SharedBuffer (source) {
            this.disposed = false;
            this.source = source;
        }

        SharedBuffer.prototype.getEnumerator = function () {
            var e, current, self = this;
            return enumeratorCreate(
                function () {
                    e && (e = self.source.getEnumerator());

                    if (e.moveNext()) {
                        current = e.getCurrent();
                        return true;
                    }
                    return false;
                },
                function () { return current; }, 
                function () { e && e.dispose(); });
        };

        SharedBuffer.prototype.dispose = function () {
            if (!this.disposed) {
                this.disposed = true;
                this.source = null;
            }
        };

        return SharedBuffer;
    }());

    /**
     * Shares the source sequence within a selector function where each enumerator can fetch the next element from the source sequence.
     * 
     * var rng = Enumerable.range(0, 10).share();
     * 
     * var e1 = rng.getEnumerator();    // Both e1 and e2 will consume elements from
     * var e2 = rng.getEnumerator();    // the source sequence.
     * 
     * ok(e1.moveNext());
     * equal(0, e1.getCurrent());
     * 
     * ok(e1.moveNext());
     * equal(1, e1.getCurrent());
     * 
     * ok(e2.moveNext());    // e2 "steals" element 2
     * equal(2, e2.getCurrent());
     * 
     * ok(e1.moveNext());    // e1 can't see element 2
     * equal(3, e1.getCurrent());
     * 
     * @param {Function} [selector] Selector function with shared access to the source sequence for each enumerator.
     * @return Sequence resulting from applying the selector function to the shared view over the source sequence.
     */
    EnumerablePrototype.share = function (selector) {
        return !selector ? 
            new SharedBuffer(source.getEnumerator()) :
            new Enumerable(function () { return selector(source.share()).getEnumerator(); });
    };

    function RefCountList(readerCount) {
        this.readerCount = readerCount;
        this.list = {};
        this.count = 0;
    }

    var RefCountListPrototype = RefCountList.prototype;
    RefCountListPrototype.clear = function () {
        this.list = {};
        this.count = 0;
    };

    RefCountListPrototype.get = function (i) {
        if (!this.list[i]) {
            throw new Error('Element no longer available in the buffer.');
        }
        var res = this.list[i];
        if (--res.count === 0) { delete this.list[i]; }
        return res.value;
    };

    RefCountListPrototype.push = function (item) {
        this.list[this.count++] = { value: item, count: this.readerCount };
        this.count++;
    };

    RefCountListPrototype.done = function () {
        this.readerCount--;
    };

    var PublishedBuffer = (function () {
        inherits(PublishedBuffer, Enumerable);

        function PublishedBuffer(source) {
            this.source = source;
            this.buffer = new RefCountList(0);
            this.disposed = false;
        }

        function getEnumerator(i) {
            var current, e;
            return enumeratorCreate(
                function () {

                }, 
                function () {
                    return current;
                }, 
                function () {

                })
        }

        PublishedBuffer.prototype.getEnumerator = function () {
            var i = this.buffer.count;
            this.buffer.count++;
            return getEnumerator.call(this, i);
        };

        PublishedBuffer.prototype.dispose = function () {
            if (!this.disposed) {
                this.source.dispose();
                this.source = null;
                this.buffer.clear();
                this.buffer = null;
                this.disposed = true;
            }
        };

        return PublishedBuffer;
    }());
