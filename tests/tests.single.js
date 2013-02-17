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
        Enumerable = root.Enumerable;

    function sequenceEqual(first, second) {
    	if (first.length !== second.length) {
    		return false;
    	}
    	for(var i = 0, len = first.length; i < len; i++) {
    		if (first[i] !== second[i]) {
    			return false;
    		}
    	}
    	return true;
    }

    QUnit.module('Single Tests');

    test('Buffer1', function () {
        var rng = Enumerable.range(0, 10);

        var res = rng.bufferWithCount(3).toArray();
        equal(4, res.length);

        ok(sequenceEqual(res[0].toArray(), [0, 1, 2 ]));
        ok(sequenceEqual(res[1].toArray(), [3, 4, 5 ]));
        ok(sequenceEqual(res[2].toArray(), [6, 7, 8 ]));
        ok(sequenceEqual(res[3].toArray(), [9]));
    });

    test('Buffer2', function () {
        var rng = Enumerable.range(0, 10);

        var res = rng.bufferWithCount(5).toArray();
        equal(2, res.length);

        ok(sequenceEqual(res[0].toArray(), [0, 1, 2, 3, 4 ]));
        ok(sequenceEqual(res[1].toArray(), [5, 6, 7, 8, 9 ]));
    });

    test('Buffer3', function () {
        var rng = Enumerable.empty();

        var res = rng.bufferWithCount(5).toArray();
        equal(0, res.length);
    });
   
    test('Buffer4', function () {
        var rng = Enumerable.range(0, 10);

        var res = rng.bufferWithCount(3, 2).toArray();
        equal(5, res.length);

        ok(sequenceEqual(res[0].toArray(), [0, 1, 2 ]));
        ok(sequenceEqual(res[1].toArray(), [2, 3, 4 ]));
        ok(sequenceEqual(res[2].toArray(), [4, 5, 6 ]));
        ok(sequenceEqual(res[3].toArray(), [6, 7, 8 ]));
        ok(sequenceEqual(res[4].toArray(), [8, 9 ]));
    });

    test('Buffer5', function () {
        var rng = Enumerable.range(0, 10);

        var res = rng.bufferWithCount(3, 4).toArray();
        equal(3, res.length);

        ok(sequenceEqual(res[0].toArray(), [0, 1, 2 ]));
        ok(sequenceEqual(res[1].toArray(), [4, 5, 6 ]));
        ok(sequenceEqual(res[2].toArray(), [8, 9 ]));
    });

    function noop () { }

    test('Do1', function () {
        var n = 0;
        Enumerable.range(0, 10).doAction(function (x) { n += x; }).forEach(noop);
        equal(45, n);
    });

    
    test('Do2', function () {
        var n = 0;
        Enumerable.range(0, 10).doAction(function (x) { n += x; }, noop, function () { n *= 2; }).forEach(noop);
        equal(90, n);
    });

    
    test('Do3', function () {
        var ex = new Error();
        var isOk = false;
        raises(function () {
            Enumerable.throwException(ex).doAction(function () { ok(false); }, function (e) { equal(ex, e); isOk = true; }).forEach(noop)
        });
        ok(isOk);
    });

    test('Do4', function () {
        var obs = new MyObserver();
        Enumerable.range(0, 10).doAction(obs).forEach(noop);

        ok(obs.done);
        equal(45, obs.sum);
    });

    function MyObserver () {
    	this.sum = 0;
    	this.done = false;
    }

    MyObserver.prototype.onNext = function (value) {
    	this.sum += value;
    };
    MyObserver.prototype.onError = function () {
    	throw new Error();
    };
    MyObserver.prototype.onCompleted = function () {
    	this.done = true;
    };

    test('Do5', function () {
        var sum = 0;
        var done = false;
        Enumerable.range(0, 10).doAction(function (x) { sum += x; }, function () { throw ex; }, function () { done = true; }).forEach(noop);

        ok(done);
        equal(45, sum);
    });

        
    test('StartWith1', function () {
        var e = Enumerable.range(1, 5);
        var r = e.startWith(0).toArray();
        ok(sequenceEqual(r, Enumerable.range(0, 6).toArray()));
    });

    test('StartWith2', function () {
        var oops = false;
        var e = Enumerable.range(1, 5).doAction(function () { oops = true; });
        var r = e.startWith(0).take(1).toArray();
        ok(!oops);
    });

        
    test('Expand1', function () {
        var res = Enumerable.returnValue(0).expand(function (x) { return Enumerable.returnValue(x + 1); }).take(10).toArray();
        ok(sequenceEqual(res, Enumerable.range(0, 10).toArray()));
    });

    
    test('Expand2', function () {
        var res = Enumerable.returnValue(3).expand(function (x){ return Enumerable.range(0, x); }).toArray();
        var exp = [
            3,
            0, 1, 2,
            0,
            0, 1,
            0
        ];
        ok(sequenceEqual(res, exp));
    }); 

    test('Distinct1', function ()
    {
        var res = Enumerable.range(0, 10).distinctBy(function (x) { return x % 5; }).toArray();
        ok(sequenceEqual(res, Enumerable.range(0, 5).toArray()));
    });

    test('Distinct2', function ()
    {
        var res = Enumerable.range(0, 10).distinctBy(function (x) { return x % 5; }, equalityComparer).toArray();
        ok(sequenceEqual(res, [0, 1]));
    });

    function equalityComparer (x, y) {
    	return x % 2 === y % 2;
    }

    
    test('DistinctUntilChanged1', function () {
        var res = Enumerable.fromArray([1, 2, 2, 3, 3, 3, 2, 2, 1]).distinctUntilChanged().toArray();
        ok(sequenceEqual(res, [1, 2, 3, 2, 1 ]));
    });
   
    test('DistinctUntilChanged2', function () {
        var res = Enumerable.fromArray([1, 1, 2, 3, 4, 5, 5, 6, 7 ]).distinctUntilChanged(function (x){ return x >> 1; }).toArray();
        ok(sequenceEqual(res, [1, 2, 4, 6 ]));
    });

    test('IgnoreElements', function () {
        var n = 0;
        Enumerable.range(0, 10).doAction(function () { n++; }).ignoreElements().take(5).forEach(noop);
        equal(10, n);
    });

    test('TakeLast_Empty', function () {
        var e = Enumerable.empty();
        var r = e.takeLast(1).toArray();
        ok(sequenceEqual(r, e.toArray()));
    });
    
    test('TakeLast_All', function () {
        var e = Enumerable.range(0, 5);
        var r = e.takeLast(5).toArray();
        ok(sequenceEqual(r, e.toArray()));
    })
    
    test('TakeLast_Part', function () {
        var e = Enumerable.range(0, 5);
        var r = e.takeLast(3).toArray();
        ok(sequenceEqual(r, e.skip(2).toArray()));
    });

    test('SkipLast_Empty', function () {
        var e = Enumerable.empty()
        var r = e.skipLast(1).toArray();
        ok(sequenceEqual(r, e.toArray()));
    });

    test('SkipLast_All', function () {
        var e = Enumerable.range(0, 5);
        var r = e.skipLast(0).toArray();
        ok(sequenceEqual(r, e.toArray()));
    });

    test('SkipLast_Part', function () {
        var e = Enumerable.range(0, 5);
        var r = e.skipLast(3).toArray();
        ok(sequenceEqual(r, e.take(2).toArray()));
    });

    test('Scan1', function () {
        var res = Enumerable.range(0, 5).scan(function (n, x) { return n + x; }).toArray();
        ok(sequenceEqual(res, [1, 3, 6, 10]));
    });

    test('Scan2', function () {
        var res = Enumerable.range(0, 5).scan(10, function (n, x) { return n - x; }).toArray();
        ok(sequenceEqual(res, [10, 9, 7, 4, 0 ]));
    });   

}(this));