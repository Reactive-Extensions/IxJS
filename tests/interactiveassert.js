(function (root, factory) {
    var freeExports = typeof exports == 'object' && exports &&
    (typeof root == 'object' && root && root == root.global && (window = root), exports);

    // Because of build optimizers
    if (typeof define === 'function' && define.amd) {
        define(['Ix', 'exports'], function (Ix, exports) {
            root.Ix = factory(root, exports, Ix);
            return root.Ix;
        });
    } else if (typeof module == 'object' && module && module.exports == freeExports) {
        module.exports = factory(root, module.exports, require('ix'));
    } else {
        root.Ix = factory(root, {}, root.Ix);
    }
}(this, function (global, exp, Ix, undefined) {
    
    Ix.assertionHelper = {
        noNext: function (iterator) {
            ok(iterator.next().done, 'Sequence has no next values');
        },
        hasNext: function (iterator, value, predicate) {
            var next = iterator.next();
            ok(!next.done, 'Sequence has next value');
            if (!predicate) {
                equal(value, next.value);
            } else {
                ok(predicate(value, next.value));
            }
        }
    };

    return Ix;
}));