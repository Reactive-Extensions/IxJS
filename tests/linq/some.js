if (!!Ix.Enumerable.prototype.some) {

  QUnit.module('Some Tests');

  var Enumerable = Ix.Enumerable;

  test('Some_Arguments', function () {
    raises(function () {
      Enumerable.prototype.some.call(null);
    });

    raises(function () {
      Enumerable.range(0, 5).some('foo');
    });
  });

  test('Some_Predicate_Match', function () {
    var xs = Enumerable.range(0, 5);

    var res = xs.some(function (x) {
      return x < 5;
    });

    ok(res);
  });

  test('Some_Predicate_NonMatch', function () {
    var xs = Enumerable.range(0, 5);

    var res = xs.some(function (x) {
      return x > 5;
    });

    ok(!res);
  });

  test('Some_Predicate_Empty', function () {
    var xs = Enumerable.empty();

    var res = xs.some(function (x) {
      ok(false);
    });

    ok(!res);
  });

  test('Some_Predicate_Match', function () {
    var xs = Enumerable.range(0, 5);

    var res = xs.some(function (x) {
      return x < 5;
    });

    ok(res);
  });

  test('Some_Predicate_Match_Index', function () {
    var xs = Enumerable.range(0, 5);

    var res = xs.some(function (x, i) {
      return i < 5;
    });

    ok(res);
  });

  test('Some_Predicate_Enumerable', function () {
    var xs = Enumerable.range(0, 5);

    var res = xs.some(function (x, i, e) {
      equal(xs, e);
      return x < 5;
    });
  });

}