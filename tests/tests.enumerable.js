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

    QUnit.module('Enumerable Tests');

    test('Select_Empty', function () {
        var xs = Enumerable.empty();

        var res = xs.select(function () {
            ok(false);
        });

        var e = res.getEnumerator();

        noNext(e);
    });

    test('Select_Multiple', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.select(function (x) {
            return x + x;
        });

        ok(res.sequenceEqual(Enumerable.fromArray([0,2,4,6,8])));
    });

    test('Select_Error', function () {
        var xs = Enumerable.throwException(new Error());

        var res = xs.select(function (x) {
            ok(false);
        });

        var e = res.getEnumerator();
        raises(function () { e.moveNext(); });
    });    

    test('Where_Empty', function () {
        var xs = Enumerable.empty();

        var res = xs.select(function () {
            ok(false);
        });

        var e = res.getEnumerator();

        noNext(e);
    });

    test('Where_Multiple', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.select(function (x) {
            return x + x;
        });

        ok(res.sequenceEqual(Enumerable.fromArray([0,2,4,6,8])));
    });      

}(this));