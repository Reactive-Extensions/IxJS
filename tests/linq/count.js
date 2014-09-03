if (!!Ix.Iterable.prototype.count) {
  QUnit.module('Every Tests');

  var Iterable = Ix.Iterable;

  test('Count_Empty', function () {
    var xs = Iterable.empty();

    var res = xs.count();

    equal(res, 0);
  });

  test('Count_Multiple', function () {
    var xs = Iterable.range(0, 5);

    var res = xs.count();

    equal(res, 5);
  });

  test('Count_Predicate_Empty', function () {
    var xs = Iterable.empty();

    var res = xs.count(function () { ok(false); });

    equal(res, 0);
  });

  test('Count_Predicate_Some', function () {
    var xs = Iterable.range(0, 5);

    var res = xs.count(function (x) {
      return x % 2 === 0;
    });

    equal(res, 3);
  });   
  
  test('Count_Predicate_ThisArg', function () {
    var xs = Iterable.range(0, 5);
    var self = {value: 42};

    var res = xs.count(function (x) {
      equal(this, self);
      return x % 2 === 0;
    }, self);
  });     
}