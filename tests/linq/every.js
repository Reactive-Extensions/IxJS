if (!!Ix.Enumerable.prototype.every) {

  QUnit.module('Every Tests');

  var Enumerable = Ix.Enumerable;

  test('Every_Arguments', function () {
    raises(function () {
      Enumerable.prototype.every.call(null);
    });

    raises(function () {
      Enumerable.range(0, 5).every('foo');
    });
  });

  test('Every_Match', function () {
    var xs = Enumerable.range(0, 5);

    var res = xs.every(function (x) {
      return x < 5;
    });

    ok(res);
  });

  test('Every_NonMatch', function () {
    var xs = Enumerable.range(0, 5);

    var res = xs.every(function (x) {
      return x % 2 === 0;
    });

    ok(!res);
  });

  test('Every_Empty', function () {
    var xs = Enumerable.empty();

    var res = xs.every(function (x) {
      ok(false);
    });

    ok(res);
  });

  test('Every_ThisArg', function () {
    var xs = Enumerable.range(0, 5);
    var self = { value: 42 };

    var res = xs.every(function (x) {
      equal(self, this);
      return x < 5;
    }, self);
  });

}