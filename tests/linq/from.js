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
  });

  test('From array', function () {
    var e = Enumerable.from([1,2,3]);

    var iterator = e[Ix.iterator]();

    hasNext(iterator, 1);
    hasNext(iterator, 2);
    hasNext(iterator, 3);
    noNext(iterator);
  });

}