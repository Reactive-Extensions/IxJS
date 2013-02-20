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

    QUnit.module('Exception Tests');

    
    test('Catch1', function () {
        var ex = new Error();
        var res = Enumerable.throwException(ex).catchException(function (e) { strictEqual(ex, e); return Enumerable.returnValue(42); }).single();
        equal(42, res);
    });

    test('Catch2', function () {
        var ex = new Error();
        var res = Enumerable.throwException(ex).catchException(function (e) { strictEqual(ex, e); return Enumerable.returnValue(42); }).single();
        equal(42, res);
    });

    test('Catch4', function () {
        var xs = Enumerable.range(0, 10);
        var res = xs.catchException(function (e) { ok(false); return Enumerable.returnValue(42); });
        ok(xs.sequenceEqual(res));
    });

    test('Catch5', function () {
        var res = Enumerable.catchException(Enumerable.range(0, 5), Enumerable.range(5, 5));
        ok(res.sequenceEqual(Enumerable.range(0, 5)));
    });
 
    test('Catch7', function () {
        var xss = [Enumerable.range(0, 5), Enumerable.range(5, 5) ];
        var res = xss[0].catchException(xss[1]);
        ok(res.sequenceEqual(Enumerable.range(0, 5)));
    });

    test('Catch8', function () {
        var res = Enumerable.catchException(Enumerable.range(0, 5).concat(Enumerable.throwException(new Error())), Enumerable.range(5, 5));
        ok(res.sequenceEqual(Enumerable.range(0, 10)));
    });
  
    test('Catch10', function () {
        var xss = [Enumerable.range(0, 5).concat(Enumerable.throwException(new Error())), Enumerable.range(5, 5) ];
        var res = xss[0].catchException(xss[1]);
        ok(res.sequenceEqual(Enumerable.range(0, 10)));
    });
    
    test('Catch11', function () {
        var e1 = new Error();
        var ex1 = Enumerable.throwException(e1);

        var e2 = new Error();
        var ex2 = Enumerable.throwException(e2);

        var e3 = new Error();
        var ex3 = Enumerable.throwException(e3);

        var res = Enumerable.catchException(Enumerable.range(0, 2).concat(ex1), Enumerable.range(2, 2).concat(ex2), ex3 );

        var e = res.getEnumerator();
        hasNext(e, 0);
        hasNext(e, 1);
        hasNext(e, 2);
        hasNext(e, 3);
        raises(function () { e.moveNext(); });
    });

    test('Finally1', function () {
        var done = false;

        var xs = Enumerable.range(0, 2).finallyDo(function () { done = true; });
        ok(!done);

        var e = xs.getEnumerator();
        ok(!done);

        hasNext(e, 0);
        ok(!done);

        hasNext(e, 1);
        ok(!done);

        noNext(e);
        ok(done);
    });

    test('Finally2', function () {
        var done = false;

        var xs = Enumerable.range(0, 2).finallyDo(function () { done = true; });
        ok(!done);

        var e = xs.getEnumerator();
        ok(!done);

        hasNext(e, 0);
        ok(!done);

        e.dispose();
        ok(done);
    });

    test('Finally3', function () {
        var done = false;

        var ex = new Error();
        var xs = Enumerable.throwException(ex).finallyDo(function () { done = true; });
        ok(!done);

        var e = xs.getEnumerator();
        ok(!done);

        try {
            hasNext(e, 0);
            ok(false);
        } catch (ex_) {
            strictEqual(ex, ex_);
        }

        ok(done);
    });
    
    test('OnErrorResumeNext1', function () {
        var xs = Enumerable.fromArray([1, 2]);
        var ys = Enumerable.fromArray([3, 4]);

        var res = xs.onErrorResumeNext(ys);
        ok(Enumerable.sequenceEqual(res, Enumerable.fromArray([1, 2, 3, 4])));
    });
    
    test('OnErrorResumeNext2', function () {
        var xs = Enumerable.fromArray([1, 2]).concat(Enumerable.throwException(new Error()));
        var ys = Enumerable.fromArray([3, 4]);

        var res = xs.onErrorResumeNext(ys);
        ok(Enumerable.sequenceEqual(res, Enumerable.fromArray([1, 2, 3, 4])));
    });
    
    test('OnErrorResumeNext3', function () {
        var xs = Enumerable.fromArray([1, 2]);
        var ys = Enumerable.fromArray([3, 4]);
        var zs = Enumerable.fromArray([5, 6]);

        var res = Enumerable.onErrorResumeNext(xs, ys, zs);
        ok(Enumerable.sequenceEqual(res, Enumerable.fromArray([1, 2, 3, 4, 5, 6])));
    });
    
    test('OnErrorResumeNext4', function () {
        var xs = Enumerable.fromArray([1, 2]).concat(Enumerable.throwException(new Error()));
        var ys = Enumerable.fromArray([3, 4]);
        var zs = Enumerable.fromArray([5, 6]);

        var res = Enumerable.onErrorResumeNext(xs, ys, zs);
        ok(Enumerable.sequenceEqual(res, Enumerable.fromArray([1, 2, 3, 4, 5, 6])));
    });

    test('Retry1', function () {
        var xs = Enumerable.range(0, 10);

        var res = xs.retry();
        ok(Enumerable.sequenceEqual(res, xs));
    });
  
    test('Retry2', function () {
        var xs = Enumerable.range(0, 10);

        var res = xs.retry(2);
        ok(Enumerable.sequenceEqual(res, xs));
    });
   
    test('Retry3', function () {
        var ex = new Error();
        var xs = Enumerable.range(0, 2).concat(Enumerable.throwException(ex));

        var res = xs.retry(2);
        var e = res.getEnumerator();
        hasNext(e, 0);
        hasNext(e, 1);
        hasNext(e, 0);
        hasNext(e, 1);
        raises(function () { e.moveNext(); });
    });   

}(this));