if (!!Ix.Iterable.prototype.some) {

  QUnit.module('Some Tests');

  var Iterable = Ix.Iterable;

  test('Some_Arguments', function () {
    raises(function () {
      Iterable.prototype.some.call(null);
    });

    raises(function () {
      Iterable.range(0, 5).some('foo');
    });
  });

  test('Some_Predicate_Match', function () {
    var xs = Iterable.range(0, 5);

    var res = xs.some(function (x) {
      return x < 5;
    });

    ok(res);
  });

  test('Some_Predicate_NonMatch', function () {
    var xs = Iterable.range(0, 5);

    var res = xs.some(function (x) {
      return x > 5;
    });

    ok(!res);
  });

  test('Some_Predicate_Empty', function () {
    var xs = Iterable.empty();

    var res = xs.some(function (x) {
      ok(false);
    });

    ok(!res);
  });

  test('Some_Predicate_Match', function () {
    var xs = Iterable.range(0, 5);

    var res = xs.some(function (x) {
      return x < 5;
    });

    ok(res);
  });

  test('Some_Predicate_Match_Index', function () {
    var xs = Iterable.range(0, 5);

    var res = xs.some(function (x, i) {
      return i < 5;
    });

    ok(res);
  });

  test('Some_Predicate_Iterable', function () {
    var xs = Iterable.range(0, 5);

    var res = xs.some(function (x, i, e) {
      equal(xs, e);
      return x < 5;
    });
  });

}