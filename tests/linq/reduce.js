if (!!Ix.Iterable.prototype.reduce) {

  QUnit.module('Reduce Tests');

  var Iterable = Ix.Iterable;

  test('Reduce_Arguments', function () {
    raises(function () {
      Iterable.prototype.reduce.call(null);
    });

    raises(function () {
      Iterable.range(0, 5).reduce('foo');
    });
  });

  test('Reduce_Func_Empty', function () {
    var xs = Iterable.empty();

    raises(function () {
      xs.reduce(function (acc, x) { return acc + x; });
    });
  });

  test('Reduce_Func_Multiple', function () {
    var xs = Iterable.range(0, 5);

    var res = xs.reduce(function (acc, x) {
      return acc + x;
    });

    equal(10, res);
  });

  test('Reduce_Func_Multiple_Index', function () {
    var xs = Iterable.range(0, 5);

    var res = xs.reduce(function (acc, x, i) {
      return acc + x + i;
    });

    equal(16, res);
  });

  test('Reduce_Func_Multiple_Iterable', function () {
    var xs = Iterable.range(0, 5);

    var res = xs.reduce(function (acc, x, i, e) {
      equal(xs, e);
      return acc + x + i;
    });
  });

  test('Reduce_Seed_Empty', function () {
    var xs = Iterable.empty();

    var res = xs.reduce(function (acc, x) {
      return acc + x;
    }, 0);

    equal(0, res);
  });

  test('Reduce_Seed_Multiple', function () {
    var xs = Iterable.range(0, 5);

    var res = xs.reduce(function (acc, x) {
      return acc + x;
    }, 0);

    equal(10, res);
  }); 

  test('Reduce_Seed_Multiple_Index', function () {
    var xs = Iterable.range(0, 5);

    var res = xs.reduce(function (acc, x, i) {
      return acc + x + i;
    }, 0);

    equal(20, res);
  }); 

  test('Reduce_Seed_Multiple_Iterable', function () {
    var xs = Iterable.range(0, 5);

    var res = xs.reduce(function (acc, x, i, e) {
      equal(xs, e);
      return acc + x + i;
    }, 0);
  }); 
}