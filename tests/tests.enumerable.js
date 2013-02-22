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

    function sequenceEqual(first, second, comparer) {
        comparer || (comparer = function (x, y) { return x === y; });
    	if (first.length !== second.length) {
    		return false;
    	}
    	for(var i = 0, len = first.length; i < len; i++) {
    		if (!comparer(first[i], second[i])) {
    			return false;
    		}
    	}
    	return true;
    }

    QUnit.module('Enumerable Tests');

    test('Aggregate_Func_Empty', function () {
        var xs = Enumerable.empty();

        raises(function () {
            xs.aggregate(function (acc, x) { return acc + x; });
        });
    });

    test('Aggregate_Func_Multiple', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.aggregate(function (acc, x) {
            return acc + x;
        });

        equal(10, res);
    });

    test('Aggregate_Seed_Empty', function () {
        var xs = Enumerable.empty();

        var res = xs.aggregate(0, function (acc, x) {
            return acc + x;
        });

        equal(0, res);
    });

     test('Aggregate_Seed_Multiple', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.aggregate(0, function (acc, x) {
            return acc + x;
        });

        equal(10, res);
    });    

    test('Reduce_Func_Empty', function () {
        var xs = Enumerable.empty();

        raises(function () {
            xs.reduce(function (acc, x) { return acc + x; });
        });
    });

    test('Reduce_Func_Multiple', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.reduce(function (acc, x) {
            return acc + x;
        });

        equal(10, res);
    });

    test('Reduce_Seed_Empty', function () {
        var xs = Enumerable.empty();

        var res = xs.reduce(function (acc, x) {
            return acc + x;
        }, 0);

        equal(0, res);
    });

     test('Reduce_Seed_Multiple', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.reduce(function (acc, x) {
            return acc + x;
        }, 0);

        equal(10, res);
    });  

     test('All/Every_Match', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.all(function (x) {
            return x < 5;
        });

        ok(res);
    });

     test('All/Every_NonMatch', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.all(function (x) {
            return x % 2 === 0;
        });

        ok(!res);
    });

     test('All/Every_Empty', function () {
        var xs = Enumerable.empty();

        var res = xs.all(function (x) {
            ok(false);
        });

        ok(res);
    });

     test('Any/Some_Empty', function () {
        var xs = Enumerable.empty();

        var res = xs.any();

        ok(!res);
    });

     test('Any/Some_Match', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.any();

        ok(res);
    });

     test('Any/Some_Predicate_Match', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.any(function (x) {
            return x < 5;
        });

        ok(res);
    });

     test('Any/Some_Predicate_NonMatch', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.any(function (x) {
            return x > 5;
        });

        ok(!res);
    });

     test('Any/Some_Predicate_Empty', function () {
        var xs = Enumerable.empty();

        var res = xs.any(function (x) {
            ok(false);
        });

        ok(!res);
    });

     test('Average_Empty', function () {
        var xs = Enumerable.empty();

        raises(function () {
            xs.average();
        });
    });  

     test('Average_Multiple', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.average();

        equal(2, res);
    });

     test('Average_Selector_Empty', function () {
        var xs = Enumerable.empty();

        raises(function () {
            xs.average(function (x) { ok(false); });
        });
    });  

     test('Average_Selector_Multiple', function () {
        var xs = Enumerable.fromArray([{value: 2}, {value: 4}]);

        var res = xs.average(function (x) { return x.value; });

        equal(3, res);
    }); 

    test('Concat', function () {
        var xs = Enumerable.range(0, 5);
        var ys = Enumerable.range(5, 5);

        var res = xs.concat(ys);

        ok(res.sequenceEqual(Enumerable.range(0, 10)));
    }); 

    test('Concat_Left_Empty', function () {
        var xs = Enumerable.empty();
        var ys = Enumerable.range(5, 5);

        var res = xs.concat(ys);

        ok(res.sequenceEqual(Enumerable.range(5, 5)));
    });   

    test('Concat_Right_Empty', function () {
        var xs = Enumerable.range(0, 5);
        var ys = Enumerable.empty();

        var res = xs.concat(ys);

        ok(res.sequenceEqual(Enumerable.range(0, 5)));
    });

    test('Contains_Empty', function () {
        var xs = Enumerable.empty();

        var res = xs.contains(3);

        ok(!res);
    });

    test('Contains_Match', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.contains(3);

        ok(res);        
    });

    test('Contains_NonMatch', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.contains(5);

        ok(!res);   
    });

    test('Contains_Comparer_Empty', function () {
        var xs = Enumerable.empty();

        var res = xs.contains({value: 3}, function (x, y) {
            ok(false);
        });

        ok(!res);
    });

    test('Contains_Comparer_Match', function () {
        var xs = Enumerable.fromArray([{value: 3}, {value: 4}]);

        var res = xs.contains({value: 3}, function (x, y) {
            return x.value === y.value;
        });

        ok(res);        
    });

    test('Contains_Comparer_NonMatch', function () {
        var xs = Enumerable.fromArray([{value: 3}, {value: 4}]);

        var res = xs.contains({value: 5}, function (x, y) {
            return x.value === y.value;
        });

        ok(!res);   
    });

    test('Count_Empty', function () {
        var xs = Enumerable.empty();

        var res = xs.count();

        equal(res, 0);
    });

    test('Count_Multiple', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.count();

        equal(res, 5);
    });

    test('Count_Predicate_Empty', function () {
        var xs = Enumerable.empty();

        var res = xs.count(function () { ok(false); });

        equal(res, 0);
    });

    test('Count_Predicate_Some', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.count(function (x) {
            return x % 2 === 0;
        });

        equal(res, 3);
    });

    test('DefaultIfEmpty_Empty', function () {
        var xs = Enumerable.empty().defaultIfEmpty(42);

        var e = xs.getEnumerator();

        hasNext(e, 42);
        noNext(e);
    });

    test('DefaultIfEmpty_Value', function () {
        var xs = Enumerable.returnValue(12).defaultIfEmpty(42);

        var e = xs.getEnumerator();

        hasNext(e, 12);
        noNext(e);
    });

    test('Distinct_Trims', function () {
        var xs = Enumerable.fromArray([1,2,2,1,3,4]);

        var res = xs.distinct();

        ok(res.sequenceEqual(Enumerable.fromArray([1,2,3,4])));
    });    

    test('Distinct_Comparer_Trims', function () {
        var xs = Enumerable.fromArray([{value: 1},{value: 1}]);

        var res = xs.distinct(function (x, y) {
            return x.value === y.value;
        });

        var e = res.getEnumerator();
        ok(e.moveNext());
        equal(1, e.getCurrent().value);
    });

    test('ElementAt_NotFound', function () {
        var xs = Enumerable.range(0, 10);

        raises(function () {
            xs.elementAt(11);
        });
    });

    test('ElementAt_Found', function () {
        var xs = Enumerable.range(0, 10);

        var res = xs.elementAt(2);

        equal(res, 2);
    });

    test('ElementAtOrDefault_NotFound', function () {
        var xs = Enumerable.range(0, 10);

        var res = xs.elementAtOrDefault(11, 0);

        equal(res, null);
    });

    test('ElementAtOrDefault_Found', function () {
        var xs = Enumerable.range(0, 10);

        var res = xs.elementAtOrDefault(2, 0);

        equal(res, 2);
    });    

    test('Except', function () {
        var xs = Enumerable.range(0, 5);
        var ys = Enumerable.range(3, 5);

        var res = xs.except(ys);

        ok(res.sequenceEqual(Enumerable.fromArray([5, 6, 7])));
    });

    test('Except_Comparer', function () {
        var xs = Enumerable.fromArray([{value: 1}, {value: 2}]);
        var ys = Enumerable.fromArray([{value: 2}, {value: 3}]);

        var res = xs.except(ys, function (x, y) { return x.value === y.value; });

        var e = res.getEnumerator();
        ok(e.moveNext());
        equal(3, e.getCurrent().value);
    });

    test('First_Empty', function () {
        var xs = Enumerable.empty();

        raises(function () { xs.first(); });
    });

    test('First_Value', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.first();

        equal(0, res);
    });

    test('FirstOrDefault_Empty', function () {
        var xs = Enumerable.empty();

        var res = xs.firstOrDefault();

        equal(res, null);
    });

    test('FirstOrDefault_Value', function () {
         var xs = Enumerable.range(0, 5);

        var res = xs.firstOrDefault();

        equal(res, 0);       
    });

    test('GroupBy_Default', function () {
        var xs = Enumerable.fromArray([{value: 1}, {value: 2}, {value: 3}, {value: 1}]);

        var res = xs.groupBy(function (x) { return x.value; });

        var e = res.getEnumerator(), current;
        ok(e.moveNext());
        current = e.getCurrent();
        equal(current.key, 1);
        equal(current.count(), 2);

        ok(e.moveNext());
        current = e.getCurrent();
        equal(current.key, 2);
        equal(current.count(), 1);

        ok(e.moveNext());
        current = e.getCurrent();
        equal(current.key, 3);
        equal(current.count(), 1);     
    });

    test('GroupBy_ElementSelector', function () {
        var xs = Enumerable.fromArray([{value: 1}, {value: 2}, {value: 3}, {value: 1}]);

        var res = xs.groupBy(function (x) { return x.value; }, function (x) { return x.value; });

        var e = res.getEnumerator(), current;
        ok(e.moveNext());
        current = e.getCurrent();
        equal(current.key, 1);
        equal(current.count(), 2);
        ok(current.sequenceEqual(Enumerable.fromArray([1,1])));

        ok(e.moveNext());
        current = e.getCurrent();
        equal(current.key, 2);
        equal(current.count(), 1);
        ok(current.sequenceEqual(Enumerable.fromArray([2])));

        ok(e.moveNext());
        current = e.getCurrent();
        equal(current.key, 3);
        equal(current.count(), 1);
        ok(current.sequenceEqual(Enumerable.fromArray([3]))); 
    });

    test('Intersect', function () {
        var xs = Enumerable.range(0, 5);
        var ys = Enumerable.range(3, 5);

        var res = xs.intersect(ys);

        ok(res.sequenceEqual(Enumerable.fromArray([3,4])));
    });

    test('Last_Empty', function () {
        var xs = Enumerable.empty();

        raises(function () { xs.last(); });
    });

    test('Last_Multiple', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.last();

        equal(res, 4);
    });

    test('LastOrDefault_Empty', function () {
        var xs = Enumerable.empty();

        var res = xs.lastOrDefault();

        equal(res, null);
    });

    test('LastOrDefault_Multiple', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.lastOrDefault();

        equal(res, 4);
    });   

    test('Max_Empty', function () {
        var xs = Enumerable.empty();

        raises(function () { xs.max(); });
    });

    test('Max_Multiple', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.max();

        equal(res, 4);
    });

    test('Max_Selector_Empty', function () {
        var xs = Enumerable.empty();

        raises(function () { xs.max(function () { ok(false); }); });
    });

    test('Max_Selector_Multiple', function () {
        var xs = Enumerable.fromArray([{value: 42}, {value: 12}]);

        var res = xs.max(function (x) { return x.value; });

        equal(res, 42);
    });    

    test('Min_Empty', function () {
        var xs = Enumerable.empty();

        raises(function () { xs.min(); });
    });

    test('Min_Multiple', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.min();

        equal(res, 0);
    });

    test('Min_Selector_Empty', function () {
        var xs = Enumerable.empty();

        raises(function () { xs.min(function () { ok(false); }); });
    });

    test('Min_Selector_Multiple', function () {
        var xs = Enumerable.fromArray([{value: 42}, {value: 12}]);

        var res = xs.min(function (x) { return x.value; });

        equal(res, 12);
    });

    test('OrderBy', function () {
        var xs = Enumerable.fromArray([1,3,5,7,9,2,4,6,8]);

        var res = xs.orderBy(function (x) { return x; });

        ok(res.sequenceEqual(Enumerable.range(1, 9)));
    });

    test('OrderByDescending', function () {
        var xs = Enumerable.fromArray([1,3,5,7,9,2,4,6,8]);

        var res = xs.orderByDescending(function (x) { return x; });

        ok(res.sequenceEqual(Enumerable.fromArray([9,8,7,6,5,4,3,2,1])));
    });   

    test('Reverse', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.reverse();

        ok(res.sequenceEqual(Enumerable.fromArray([4,3,2,1,0])));
    });

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

     test('Select_Throws', function () {
        var xs = Enumerable.range(0, 5);
        var i = 0;

        var res = xs.select(function (x) {
            if (i++ === 2) {
                throw new Error();
            }
            return x;
        });

        var e = res.getEnumerator();
        hasNext(e, 0);
        hasNext(e, 1);
        raises(function () { e.moveNext(); });
    });

    test('SelectMany_1', function () {
        var xs = Enumerable.range(1, 3);

        var res = xs.selectMany(function (x) {
            return Enumerable.range(1, x);
        });

        ok(res.sequenceEqual(Enumerable.fromArray([1,1,2,1,2,3])));
    });

    test('SequenceEqual', function () {
        var xs = Enumerable.range(0, 5);
        var ys = Enumerable.range(0, 5);

        ok(xs.sequenceEqual(ys));
    });

    test('SequenceEqual_Failure', function () {
        var xs = Enumerable.range(0, 5);
        var ys = Enumerable.range(0, 6);

        ok(!xs.sequenceEqual(ys));
    });

    test('SequenceEqual_Comparer', function () {
        var xs = Enumerable.range(0, 5);
        var ys = Enumerable.range(0, 5);

        ok(xs.sequenceEqual(ys, function (x, y) { return x === y; }));
    });

    test('SequenceEqual_Comparer_Failure', function () {
        var xs = Enumerable.range(0, 5);
        var ys = Enumerable.range(0, 6);

        ok(!xs.sequenceEqual(ys, function (x, y) { return x === y; }));
    });

    test('Single_Empty', function () {
        var xs = Enumerable.empty();

        raises(function () { xs.single(); });
    });

    test('Single_One', function () {
        var xs = Enumerable.returnValue(42);

        var res = xs.single();

        equal(res, 42);
    });

    test('Single_Multiple', function () {
        var xs = Enumerable.range(0, 5);

        raises(function () { xs.single(); });
    });    

    test('SingleOrDefault_Empty', function () {
        var xs = Enumerable.empty();

        var res = xs.singleOrDefault();

        equal(res, null);
    });

    test('SingleOrDefault_One', function () {
        var xs = Enumerable.returnValue(42);

        var res = xs.singleOrDefault();

        equal(res, 42);
    });

    test('SingleOrDefault_Multiple', function () {
        var xs = Enumerable.range(0, 5);

        raises(function () { xs.singleOrDefault(); });
    });      

    test('Skip_Zero', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.skip(0);

        ok(res.sequenceEqual(xs));
    });

    test('Skip_Multiple', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.skip(2);

        ok(res.sequenceEqual(Enumerable.range(2, 3)));
    });

    test('SkipWhile_None', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.skipWhile(function (x) { return x < 5; });

        var e = res.getEnumerator();
        noNext(e);
    });

    test('SkipWhile_Some', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.skipWhile(function (x) { return x < 2; });

        ok(res.sequenceEqual(Enumerable.fromArray([2,3,4])));
    });

    test('Sum_Empty', function () {
        var xs = Enumerable.empty();

        var res = xs.sum();

        equal(res, 0);
    });

    test('Sum_Some', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.sum();

        equal(res, 10);
    });    

    test('Take_Zero', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.take(5);

        ok(res.sequenceEqual(xs));
    });

    test('Take_Multiple', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.take(2);

        ok(res.sequenceEqual(Enumerable.range(0, 2)));
    });

    test('Takehile_None', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.takeWhile(function (x) { return x > 5; });

        var e = res.getEnumerator();
        noNext(e);
    });

    test('TakeWhile_Some', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.takeWhile(function (x) { return x % 2 === 0; });

        ok(res.sequenceEqual(Enumerable.fromArray([0])));
    });

    test('ThenBy_1', function () {
        var xs = Enumerable.fromArray([ "grape", "passionfruit", "banana", "mango", 
                              "orange", "raspberry", "apple", "blueberry" ]);

        var res = xs
            .orderBy(function (x) { return x.length; })
            .thenBy(function (x) { return x; });

        ok(res.sequenceEqual(Enumerable.fromArray([
            'apple',
            'grape',
            'mango',
            'banana',
            'orange',
            'blueberry',
            'raspberry',
            'passionfruit'
        ])));
    });   

    test('ToArray_1', function () {
        var xs = Enumerable.range(0, 5);

        var res = xs.toArray();

        ok(sequenceEqual([0,1,2,3,4], res));
    });

    test('Union_1', function () {
        var xs = Enumerable.fromArray([ 5, 3, 9, 7, 5, 9, 3, 7 ]);
        var ys = Enumerable.fromArray([ 8, 3, 6, 4, 4, 9, 1, 0 ]);

        var res = xs.union(ys);

        ok(res.sequenceEqual(Enumerable.fromArray([5, 3, 9, 7, 8, 6, 4, 1, 0])));
    });

    test('Union_2', function () {
        function comparer(x, y) { return x.name === y.name && x.code === y.code; }

        var xs = Enumerable.fromArray([{ name: 'apple', code: 9 }, { name: 'orange', code : 4 } ]);
        var ys = Enumerable.fromArray([{ name: 'apple', code: 9 }, { name: 'lemon', code: 12 } ]);

        var res = xs.union(ys, comparer);

        ok(sequenceEqual(
            res.toArray(), 
            [
                { name: 'apple', code: 9 },
                { name: 'orange', code : 4 },
                { name: 'lemon', code: 12 }
            ],
            comparer));
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

        var res = xs.where(function (x) {
            return x % 2 === 0;
        });

        ok(res.sequenceEqual(Enumerable.fromArray([0,2,4])));
    });

      test('Where_Error', function () {
        var xs = Enumerable.throwException(new Error());

        var res = xs.where(function (x) {
            ok(false);
        });

        var e = res.getEnumerator();
        raises(function () { e.moveNext(); });
    });

     test('Where_Throws', function () {
        var xs = Enumerable.range(0, 5);
        var i = 0;

        var res = xs.where(function (x) {
            if (i++ === 2) {
                throw new Error();
            }
            return x % 2 === 0;
        });

        var e = res.getEnumerator();
        hasNext(e, 0);
        raises(function () { e.moveNext(); });
    });

    test('Zip', function () {
        var xs = Enumerable.fromArray([ 1, 2, 3, 4 ]);
        var ys = Enumerable.fromArray([ 'one', 'two', 'three' ]);

        var res = xs.zip(ys, function (x, y) { return x + ' ' + y; });

        ok(res.sequenceEqual(Enumerable.fromArray(['1 one', '2 two', '3 three'])));
    });

    test('Concat_1', function () {
        var xs = Enumerable.range(0, 5);
        var ys = Enumerable.range(5, 5);

        var res = Enumerable.concat(xs, ys);

        ok(res.sequenceEqual(Enumerable.range(0, 10)));
    });

    function myEnumerator() {
        var current, values = [1,2], index = 0;
        return Enumerator.create(
            function () {
                if (index < 2) {
                    current = values[index++];
                    return true;
                }
                return false;
            },
            function () {
                return current;
            });
    }

    test('Create_1', function () {
        var hot = false;
        var res = Enumerable.create(function () {
            hot = true;
            return myEnumerator();
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

    test('Empty_1', function () {
        var xs = Enumerable.empty();

        var res = xs.getEnumerator();

        noNext(res);
    });

    test('FromArray_1', function () {
        var xs = Enumerable.fromArray([1,2,3]);

        ok(xs.sequenceEqual(Enumerable.range(1, 3)));
    });

    test('Range_1', function () {
        var xs = Enumerable.range(0, 5);

        ok(xs.sequenceEqual(Enumerable.fromArray([0,1,2,3,4])));
    });

    test('Repeat_1', function () {
        var xs = Enumerable.repeat(42);

        var res = xs.getEnumerator();

        hasNext(res, 42);
        hasNext(res, 42);
        hasNext(res, 42);
        hasNext(res, 42);
        hasNext(res, 42);
    });

    test('Repeat_2', function () {
        var xs = Enumerable.repeat(42, 2);

        var res = xs.getEnumerator();

        hasNext(res, 42);
        hasNext(res, 42);
        noNext(res);
    });    

}(this));