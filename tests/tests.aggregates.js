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

    QUnit.module('Aggregate Tests');

    test('IsEmpty_Empty', function () {
        ok(Enumerable.empty().isEmpty());
    });

    test('IsEmpty_Empty', function () {
        ok(!Enumerable.returnValue(1).isEmpty());
    }); 

    test('Min', function () {
        equal(3, Enumerable.fromArray([5,3,7]).minBy(identity, function (x, y) { return x % 3 - y % 3; }).first());
    });

    test('MinBy', function () {
        var res = Enumerable.fromArray([2, 5, 0, 7, 4, 3, 6, 2, 1]).minBy(function (x) { return x % 3; });
        ok(res.sequenceEqual(Enumerable.fromArray([ 0, 3, 6])));
    });

    test('MinBy_Empty', function () {
        raises(function () {
            Enumerable.empty().minBy(identity);
        });
    });

    test('Max', function () {
        equal(5, Enumerable.fromArray([2, 5, 3, 7]).maxBy(identity, function (x, y) { return x % 7 - y % 7; }).first());
    });

    test('MaxBy', function () {
        var res = Enumerable.fromArray([2, 5, 0, 7, 4, 3, 6, 2, 1]).maxBy(function (x) { return x % 3; });
        ok(res.sequenceEqual(Enumerable.fromArray([2, 5, 2 ])));
    });

    test('MinBy_Empty', function () {
        raises(function () {
            Enumerable.empty().maxBy(identity);
        });
    });


}(this));