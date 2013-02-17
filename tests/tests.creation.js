/*

Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.
Microsoft Open Technologies would like to thank its contributors, a list
of whom are at http://aspnetwebstack.codeplex.com/wikipage?title=Contributors.

Licensed under the Apache License, Version 2.0 (the "License"); you
may not use this file except in compliance with the License. You may
obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing permissions
and limitations under the License.
*/

(function (window) {

    function identity (x) { return x; }

    var root = window.Ix,
        Enumerator = root.Enumerator,
        Enumerable = root.Enumerable,
        noNext = root.assertionHelper.noNext,
        hasNext = root.assertionHelper.hasNext;

    function MyEnumerator() {
        var values = [1, 2], length = values.length, index = 0, current;
        return Enumerator.create(function () {
            if (index === length) {
                return false;
            }
            current = values[index++];
            return true;
        }, function () {
            return current;
        });
    }

    QUnit.module('Creation Tests');

    test('Create1', function () {
        var hot = false,
            res = Enumerable.create(function () {
                hot = true;
                return new MyEnumerator();
            });

        ok(!hot);

        var e = res.getEnumerator();
        ok(hot);

        hasNext(e, 1);
        hasNext(e, 2);
        noNext(e);

        hot = false;
        var f = res.getEnumerator();
        ok(hot);
    });

    test('Return', function () {
        equal(42, Enumerable.returnValue(42).single());
    });

    test('Throw', function () {
        var ex = new Error('Woops');
        var xs = Enumerable.throwException(ex);

        var e = xs.getEnumerator();
        raises(function () { e.moveNext(); });
    });

    test('Defer1', function () {
        var i = 0;
        var n = 5;
        var xs = Enumerable.defer(function () {
            i++;
            return Enumerable.range(0, n);
        });

        equal(0, i);

        ok(xs.sequenceEqual(Enumerable.range(0, n)));
        equal(1, i);

        n = 3;
        ok(xs.sequenceEqual(Enumerable.range(0, n)));
        equal(2, i);       
    });

    test('Defer2', function () {
        var xs = Enumerable.defer(function () {
            throw new Error('woops');
        });

        raises(function () { xs.getEnumerator().moveNext(); });        
    });

    test('Generate', function () {
        var res = Enumerable.generate(
            0, 
            function (x) { return x < 5; }, 
            function (x) { return x + 1; }, 
            function (x) { return x * x; });
        ok(res.sequenceEqual(Enumerable.fromArray([0, 1, 4, 9, 16])));
    });

    function MyDisposable () {
        this.done = false;
    }
    MyDisposable.prototype.dispose = function () {
        this.done = true;
    };

    test('Using1', function () {
        var d;

        var xs = Enumerable.using(function () { 
            return d = new MyDisposable(); 
        }, function (d_) { 
            return Enumerable.returnValue(1); 
        });
        ok(!d);

        var d1;
        xs.forEach(function () { d1 = d; ok(d1); ok(!d1.done); });
        ok(d1.done);

        var d2;
        xs.forEach(function () { d2 = d; ok(d2); ok(!d2.done); });
        ok(d2.done);

        notEqual(d1, d2);
    });

    test('Using2', function () {
        var d;

        var xs = Enumerable.using(function () { 
            return d = new MyDisposable(); 
        }, function (d_) { 
            return Enumerable.throwException(new Error('Woops'));
        });
        ok(!d);

        raises(function () { xs.forEach(function () { }); });
        ok(d.done);
    });

    test('Using3', function () {
        var d;

        var xs = Enumerable.using(function () { 
            return d = new MyDisposable(); 
        }, function (d_) { 
            throw new Error('Woops'); 
        });
        ok(!d);

        raises(function () { xs.forEach(function () { }); });
        ok(d.done);
    });

    test('RepeatElementInfinite', function () {
        var xs = Enumerable.repeat(42).take(1000);
        ok(xs.all(function (x) { return x === 42; }));
        ok(xs.count() == 1000);
    });

    test('RepeatSequence1', function () {
        var i = 0;
        var xs = Enumerable.fromArray([1,2]).doAction(function () { i++; }).repeat();

        var res = xs.take(10).toArray();
        equal(10, res.length);
        ok(Enumerable.fromArray(res).bufferWithCount(2).select(function (b) { return b.sum(); }).all(function (x) { return x === 3; }));
        equal(10, i);
    });

    test('RepeatSequence2', function () {
        var i = 0;
        var xs = Enumerable.fromArray([1,2]).doAction(function () { i++; }).repeat(5);

        var res = xs.toArray();
        equal(10, res.length);
        ok(Enumerable.fromArray(res).bufferWithCount(2).select(function (b) { return b.sum(); }).all(function (x) { return x === 3; }));
        equal(10, i);
    });

}(this));