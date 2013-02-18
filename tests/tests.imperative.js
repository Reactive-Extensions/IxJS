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

    QUnit.module('Imperative Tests');

    test('While1', function () {
        var x = 5;
        var res = Enumerable.whileDo(function () { return x > 0; }, Enumerable.defer(function () { return Enumerable.returnValue(x); }).doAction(function () { x--; })).toArray();
        ok(sequenceEqual(res, [5, 4, 3, 2, 1 ]));
    });

    test('While2', function () {
        var x = 0;
        var res = Enumerable.whileDo(function () { return x > 0; }, Enumerable.defer(function () { return Enumerable.returnValue(x); }).doAction(function () { x--; })).toArray();
        ok(sequenceEqual(res, []));
    });

    test('DoWhile1', function () {
        var x = 5;
        var res = Enumerable.doWhile(Enumerable.defer(function () { return Enumerable.returnValue(x); }).doAction(function () { x--; }), function () { return x > 0; }).toArray();
        ok(sequenceEqual(res, [5, 4, 3, 2, 1 ]));
    });

    test('DoWhile2', function () {
        var x = 0;
        var res = Enumerable.doWhile(Enumerable.defer(function () { return Enumerable.returnValue(x); }).doAction(function () { x--; }), function () { return x > 0; }).toArray();
        ok(sequenceEqual(res, [0]));
    });
    
    test('If1', function () {
        var x = 5;
        var res = Enumerable.ifThen(function () { return x > 0; }, Enumerable.returnValue(1), Enumerable.returnValue(-1));

        equal(1, res.single());

        x = -x;
        equal(-1, res.single());
    });
    
    test('If2', function () {
        var x = 5;
        var res = Enumerable.ifThen(function () { return x > 0; }, Enumerable.returnValue(1));

        equal(1, res.single());

        x = -x;
        ok(res.isEmpty());
    });
    
    test('Case1', function () {
        var x = 1;
        var d = 'd';
        var res = Enumerable.cases(function () { return x; }, {
            0: Enumerable.returnValue('a'),
            1: Enumerable.returnValue('b'),
            2: Enumerable.returnValue('c'),
            3: Enumerable.defer(function () { return Enumerable.returnValue(d); })
        });

        equal('b', res.single());
        equal('b', res.single());

        x = 0;
        equal('a', res.single());

        x = 2;
        equal('c', res.single());

        x = 3;
        equal('d', res.single());

        d = 'e';
        equal('e', res.single());

        x = 4;
        ok(res.isEmpty());
    });

    test('Case2', function () {
        var x = 1;
        var d = 'd';
        var res = Enumerable.cases(function () { return x; }, 
        {
            0: Enumerable.returnValue('a'),
            1: Enumerable.returnValue('b'),
            2: Enumerable.returnValue('c'),
            3: Enumerable.defer(function () { return Enumerable.returnValue(d); })
        }, Enumerable.returnValue('z'));

        equal('b', res.single());
        equal('b', res.single());

        x = 0;
        equal('a', res.single());

        x = 2;
        equal('c', res.single());

        x = 3;
        equal('d', res.single());

        d = 'e';
        equal('e', res.single());

        x = 4;
        equal('z', res.single());
    });       

    function arrayMap(array, selector) {
		var results = [];
    	for (i = 0, len = array.length; i < len; i++) {
    		results.push(selector(array[i]));
    	}
    	return results;
    }

    test('For', function () {
        var res = Enumerable.forIn(Enumerable.fromArray([ 1, 2, 3 ]), function (x) { return Enumerable.range(0, x); }).toArray();
        var mapped = arrayMap(res, function (x) { return x.toArray(); });
        ok(sequenceEqual(mapped[0], [0]));
        ok(sequenceEqual(mapped[1], [0, 1]));
        ok(sequenceEqual(mapped[2], [0, 1, 2]));
    });

}(this));        