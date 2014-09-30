if (!!Ix.Enumerable.prototype.average) {

  QUnit.module('Average Tests');

  var Enumerable = Ix.Enumerable;

  test('Average_Arguments', function () {
    raises(function () {
      Enumerable.range(0, 5).average('foo');
    });
  });  

  test('Average_Empty', function () {
    raises(function () {
      Enumerable.empty().average();
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
    var xs = Enumerable.of({value: 2}, {value: 4});

    var res = xs.average(function (x) { return x.value; });

    equal(3, res);
  }); 

  test('Average_Selector_ThisArg', function () {
    var xs = Enumerable.of({value: 2}, {value: 4});
    var self = {value: 42};

    var res = xs.average(function (x) { 
      equal(self, this);
      return x.value; 
    }, self);
  });   

}