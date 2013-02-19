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

    QUnit.module('Buffering Tests');

    test('Share1', function () {
        var rng = Enumerable.range(0, 5).share();

        var e1 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e1, 1);
        hasNext(e1, 2);
        hasNext(e1, 3);
        hasNext(e1, 4);
        noNext(e1);
    });
    
    test('Share2', function () {
        var rng = Enumerable.range(0, 5).share();

        var e1 = rng.getEnumerator();
        var e2 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e2, 1);
        hasNext(e1, 2);
        hasNext(e2, 3);
        hasNext(e1, 4);
        noNext(e2);
        noNext(e1);
    });

    test('Share3', function () {
        var rng = Enumerable.range(0, 5).share();

        var e1 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e1, 1);
        hasNext(e1, 2);

        var e2 = rng.getEnumerator();
        hasNext(e2, 3);
        hasNext(e2, 4);
        noNext(e2);
        noNext(e1);
    });
  
    test('Share4', function () {
        var rng = Enumerable.range(0, 5).share();

        var e1 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e1, 1);
        hasNext(e1, 2);

        e1.dispose();
        ok(!e1.moveNext());
    });

    test('Share5', function () {
        var rng = Enumerable.range(0, 5).share();

        var e1 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e1, 1);
        hasNext(e1, 2);

        rng.dispose();
        raises(function () { e1.moveNext(); });
        raises(function () { rng.getEnumerator(); });
        raises(function () { rng.getEnumerator(); });
    });

    test('Share6', function () {
        var rng = Enumerable.range(0, 5).share();

        var e1 = rng.getEnumerator();
        ok(e1.moveNext());
        equal(0, e1.getCurrent());
    });

    test('Publish0', function () {
        var n = 0;
        var rng = tick(function (i) { n += i; }).publish();

        var e1 = rng.getEnumerator();
        var e2 = rng.getEnumerator();

        hasNext(e1, 0);
        equal(0, n);

        hasNext(e1, 1);
        equal(1, n);

        hasNext(e1, 2);
        equal(3, n);
        hasNext(e2, 0);
        equal(3, n);

        hasNext(e1, 3);
        equal(6, n);
        hasNext(e2, 1);
        equal(6, n);

        hasNext(e2, 2);
        equal(6, n);
        hasNext(e2, 3);
        equal(6, n);

        hasNext(e2, 4);
        equal(10, n);
        hasNext(e1, 4);
        equal(10, n);
    });

    function tick(action) {
        return new Enumerable(function () {
            var i = 0, isFirst = true;
            return Enumerator.create(
                function () {
                    if (!isFirst) { i++; }
                    action(i);
                    isFirst = false;
                    return true;
                },
                function () { return i; }
            );
        });
    }

    test('Publish1', function () {
        var rng = Enumerable.range(0, 5).publish();

        var e1 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e1, 1);
        hasNext(e1, 2);
        hasNext(e1, 3);
        hasNext(e1, 4);
        noNext(e1);
    });

    test('Publish2', function () {
        var rng = Enumerable.range(0, 5).publish();

        var e1 = rng.getEnumerator();
        var e2 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e2, 0);
        hasNext(e1, 1);
        hasNext(e2, 1);
        hasNext(e1, 2);
        hasNext(e2, 2);
        hasNext(e1, 3);
        hasNext(e2, 3);
        hasNext(e1, 4);
        hasNext(e2, 4);
        noNext(e1);
        noNext(e2);
    });

    test('Publish3', function () {
        var rng = Enumerable.range(0, 5).publish();

        var e1 = rng.getEnumerator();
        var e2 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e1, 1);
        hasNext(e1, 2);
        hasNext(e1, 3);
        hasNext(e1, 4);
        hasNext(e2, 0);
        hasNext(e2, 1);
        hasNext(e2, 2);
        hasNext(e2, 3);
        hasNext(e2, 4);
        noNext(e1);
        noNext(e2);
    });

    test('Publish4', function () {
        var rng = Enumerable.range(0, 5).publish();

        var e1 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e1, 1);
        hasNext(e1, 2);
        var e2 = rng.getEnumerator();
        hasNext(e1, 3);
        hasNext(e1, 4);
        hasNext(e2, 3);
        hasNext(e2, 4);
        noNext(e1);
        noNext(e2);
    });

    test('Publish5', function () {
        var rng = Enumerable.range(0, 5).publish();

        var e1 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e1, 1);
        hasNext(e1, 2);
        e1.dispose();

        var e2 = rng.getEnumerator();
        hasNext(e2, 3);
        hasNext(e2, 4);
        noNext(e2);
    });

    test('Publish6', function () {
        var ex = new Error();
        var rng = Enumerable.range(0, 2).concat(Enumerable.throwException(ex)).publish();

        var e1 = rng.getEnumerator();
        var e2 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e1, 1);
        raises(function () { e1.moveNext(); });

        hasNext(e2, 0);
        hasNext(e2, 1);
        raises(function () { e2.moveNext(); });
    });

    test('Publish7', function () {
        var rng = Enumerable.range(0, 5).publish();

        var e1 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e1, 1);
        hasNext(e1, 2);
        
        var e2 = rng.getEnumerator();
        hasNext(e2, 3);
        hasNext(e2, 4);
        noNext(e2);

        hasNext(e1, 3);
        hasNext(e1, 4);
        noNext(e2);

        var e3 = rng.getEnumerator();
        noNext(e3);
    });

    test('Publish8', function () {
        var rng = Enumerable.range(0, 5).publish();

        var e1 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e1, 1);
        hasNext(e1, 2);

        rng.dispose();
        raises(function () { e1.moveNext(); });
        raises(function () { rng.getEnumerator(); });
        raises(function () { rng.getEnumerator(); });
    });

    test('Publish9', function () {
        var rng = Enumerable.range(0, 5).publish();

        var e1 = rng.getEnumerator();
        ok(e1.moveNext());
        equal(0, e1.getCurrent());
    });

    test('Publish10', function () {
        var rnd = rand().take(1000).publish();
        ok(rnd.zip(rnd, function (l, r) { return l === r; }).all(function (x) { return x; }));
    });


    function rand() {
        return new Enumerable(function () {
            var i = 0;
            return Enumerator.create(
                function () {
                    i = Math.random();
                    return true;
                },
                function () { return i; }
            );
        });
    }                                                          

   test('Memoize0', function () {
        var n = 0;
        var rng = tick(function (i) { n += i; }).memoize();

        var e1 = rng.getEnumerator();
        var e2 = rng.getEnumerator();

        hasNext(e1, 0);
        equal(0, n);

        hasNext(e1, 1);
        equal(1, n);

        hasNext(e1, 2);
        equal(3, n);
        hasNext(e2, 0);
        equal(3, n);

        hasNext(e1, 3);
        equal(6, n);
        hasNext(e2, 1);
        equal(6, n);

        hasNext(e2, 2);
        equal(6, n);
        hasNext(e2, 3);
        equal(6, n);

        hasNext(e2, 4);
        equal(10, n);
        hasNext(e1, 4);
        equal(10, n);
    });

    test('Publish11', function () {
        var rng = Enumerable.range(0, 5).publish();

        var e1 = rng.getEnumerator();
        var e2 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e1, 1);
        hasNext(e1, 2);
        e1.dispose();

        hasNext(e2, 0);
        hasNext(e2, 1);
        e2.dispose();

        var e3 = rng.getEnumerator();
        hasNext(e3, 3);
        hasNext(e3, 4);
        noNext(e3);
    });
    
    test('Memoize1', function () {
        var rng = Enumerable.range(0, 5).memoize();

        var e1 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e1, 1);
        hasNext(e1, 2);
        hasNext(e1, 3);
        hasNext(e1, 4);
        noNext(e1);
    });
    
    test('Memoize2', function () {
        var rng = Enumerable.range(0, 5).memoize();

        var e1 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e1, 1);
        hasNext(e1, 2);
        hasNext(e1, 3);
        hasNext(e1, 4);
        noNext(e1);

        var e2 = rng.getEnumerator();
        hasNext(e2, 0);
        hasNext(e2, 1);
        hasNext(e2, 2);
        hasNext(e2, 3);
        hasNext(e2, 4);
        noNext(e2);
    });
    
    test('Memoize3', function () {
        var rng = Enumerable.range(0, 5).memoize();

        var e1 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e1, 1);
        hasNext(e1, 2);

        var e2 = rng.getEnumerator();
        hasNext(e1, 3);
        hasNext(e2, 0);
        hasNext(e2, 1);
        hasNext(e1, 4);
        hasNext(e2, 2);
        noNext(e1);

        hasNext(e2, 3);
        hasNext(e2, 4);
        noNext(e2);
    });
    
    test('Memoize4', function () {
        var rng = Enumerable.range(0, 5).memoize(2);

        var e1 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e1, 1);
        hasNext(e1, 2);

        var e2 = rng.getEnumerator();
        hasNext(e2, 0);
        hasNext(e2, 1);
        hasNext(e2, 2);

        var e3 = rng.getEnumerator();
        raises(function () { e3.moveNext(); });
    });
    
    test('Memoize6', function () {
        var ex = new Error();
        var rng = Enumerable.range(0, 2).concat(Enumerable.throwException(ex)).memoize();

        var e1 = rng.getEnumerator();
        var e2 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e1, 1);
        raises(function () { e1.moveNext(); });

        hasNext(e2, 0);
        hasNext(e2, 1);
        raises(function () { e2.moveNext(); });
    });
    
    test('Memoize7', function () {
        var rng = Enumerable.range(0, 5).memoize();

        var e1 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e1, 1);
        hasNext(e1, 2);
        e1.dispose();

        var e2 = rng.getEnumerator();
        hasNext(e2, 0);
        hasNext(e2, 1);
        e2.dispose();

        var e3 = rng.getEnumerator();
        hasNext(e3, 0);
        hasNext(e3, 1);
        hasNext(e3, 2);
        hasNext(e3, 3);
        hasNext(e3, 4);
        noNext(e3);
    });
    
    test('Memoize8', function () {
        var rng = Enumerable.range(0, 5).memoize();

        var e1 = rng.getEnumerator();
        hasNext(e1, 0);
        hasNext(e1, 1);
        hasNext(e1, 2);

        rng.dispose();
        raises(function () { e1.moveNext(); });
        raises(function () { rng.getEnumerator(); });
        raises(function () { rng.getEnumerator(); });
    });
    
    test('Memoize9', function () {
        var rng = Enumerable.range(0, 5).memoize();

        var e1 = rng.getEnumerator();
        ok(e1.moveNext());
        equal(0, e1.getCurrent());
    });
    
    test('Memoize10', function () {
        var rnd = rand().take(1000).memoize();
        ok(rnd.zip(rnd, function (l, r) { return l == r; }).all(function (x) { return x; }));
    });

}(this));