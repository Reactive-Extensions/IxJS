if (!!Ix.Iterable.from) {

  QUnit.module('From Tests');

  var Iterable = Ix.Iterable,
    assertionHelper = Ix.assertionHelper,
    hasNext = assertionHelper.hasNext,
    noNext = assertionHelper.noNext;

  test('From_Arguments', function () {
    raises(function () {
      Iterable.from(null);
    });

    raises(function () {
      Iterable.from([1,2,3], 'foo');
    });    
  });

  test('From array', function () {
    var e = Iterable.from([1,2,3]);

    var iterator = e[Ix.iterator]();

    hasNext(iterator, 1);
    hasNext(iterator, 2);
    hasNext(iterator, 3);
    noNext(iterator);
  });

  test('From Set', function () {
    var e = Iterable.from(new Set(['foo', 'bar']));

    var iterator = e[Ix.iterator]();

    hasNext(iterator, 'foo');
    hasNext(iterator, 'bar');
    noNext(iterator);    
  });

  test('From Map', function () {
    var e = Iterable.from(new Map([[1, 2], [2, 4], [4, 8]]))

    var iterator = e[Ix.iterator]();

    hasNext(iterator, [1,2]);
    hasNext(iterator, [2,4]);
    hasNext(iterator, [4,8]);    
    noNext(iterator);    
  });

  test('From String', function () {
    var e = Iterable.from('foo');

    var iterator = e[Ix.iterator]();

    hasNext(iterator, 'f');
    hasNext(iterator, 'o');
    hasNext(iterator, 'o');    
    noNext(iterator);    
  });  

  test('From arguments', function () {
    function f() {
      return Iterable.from(arguments);
    }

    var e = f(1,2,3);

    var iterator = e[Ix.iterator]();

    hasNext(iterator, 1);
    hasNext(iterator, 2);
    hasNext(iterator, 3);
    noNext(iterator);    
  });  

  test('From Array with mapFn', function () {
    var e = Iterable.from([1, 2, 3], function (x) { return x + x; });  

    var iterator = e[Ix.iterator]();

    hasNext(iterator, 2);
    hasNext(iterator, 4);
    hasNext(iterator, 6);    
    noNext(iterator);    
  });    

  test('From object with length with mapFn', function () {
    var e = Iterable.from({length: 3}, function (x, i) { return i; });  

    var iterator = e[Ix.iterator]();

    hasNext(iterator, 0);
    hasNext(iterator, 1);
    hasNext(iterator, 2);    
    noNext(iterator);    
  });   

  test('From with mapFn and thisArg', function () {
    var self = {value: 42};
    var e = Iterable.from([1, 2, 3], function (x) { equal(this, self); return x + x; }, self);  

    e.forEach(function () { }); 
  });   
}