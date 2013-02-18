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

}(this));