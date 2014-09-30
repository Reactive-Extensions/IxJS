if (!!Ix.Enumerable.from) {

  QUnit.module('From Tests');

  var Enumerable = Ix.Enumerable,
    assertionHelper = Ix.assertionHelper,
    hasNext = assertionHelper.hasNext,
    noNext = assertionHelper.noNext;

  test('From_Arguments', function () {
    raises(function () {
      Enumerable.from(null);
    });

    raises(function () {
      Enumerable.from([1,2,3], 'foo');
    });    
  });

  test('From array', function () {
    var e = Enumerable.from([1,2,3]);

    var iterator = e[Ix.iterator]();

    hasNext(iterator, 1);
    hasNext(iterator, 2);
    hasNext(iterator, 3);
    noNext(iterator);
  });

  test('From Set', function () {
    var e = Enumerable.from(new Set(['foo', 'bar']));

    var iterator = e[Ix.iterator]();

    hasNext(iterator, 'foo');
    hasNext(iterator, 'bar');
    noNext(iterator);    
  });

  test('From Map', function () {
    var e = Enumerable.from(new Map([[1, 2], [2, 4], [4, 8]]));

    var iterator = e[Ix.iterator]();

    hasNext(iterator, [1,2]);
    hasNext(iterator, [2,4]);
    hasNext(iterator, [4,8]);    
    noNext(iterator);    
  });

  test('From String', function () {
    var e = Enumerable.from('foo');

    var iterator = e[Ix.iterator]();

    hasNext(iterator, 'f');
    hasNext(iterator, 'o');
    hasNext(iterator, 'o');    
    noNext(iterator);    
  });  

  test('From arguments', function () {
    function f() {
      return Enumerable.from(arguments);
    }

    var e = f(1,2,3);

    var iterator = e[Ix.iterator]();

    hasNext(iterator, 1);
    hasNext(iterator, 2);
    hasNext(iterator, 3);
    noNext(iterator);    
  });  

  test('From Array with mapFn', function () {
    var e = Enumerable.from([1, 2, 3], function (x) { return x + x; });  

    var iterator = e[Ix.iterator]();

    hasNext(iterator, 2);
    hasNext(iterator, 4);
    hasNext(iterator, 6);    
    noNext(iterator);    
  });    

  test('From object with length with mapFn', function () {
    var e = Enumerable.from({length: 3}, function (x, i) { return i; });  

    var iterator = e[Ix.iterator]();

    hasNext(iterator, 0);
    hasNext(iterator, 1);
    hasNext(iterator, 2);    
    noNext(iterator);    
  });   

  test('From with mapFn and thisArg', function () {
    var self = {value: 42};
    var e = Enumerable.from([1, 2, 3], function (x) { equal(this, self); return x + x; }, self);  

    e.forEach(function () { }); 
  });   
}