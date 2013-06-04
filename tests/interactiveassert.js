(function (global) {
    
    var root = global.Ix;

    root.assertionHelper = {
        noNext: function (sequence) {
            ok(!sequence.moveNext(), 'Sequence has no next values');
        },
        hasNext: function (sequence, value, predicate) {
            ok(sequence.moveNext(), 'Sequence has next value');
            if (!predicate) {
                equal(value, sequence.getCurrent());
            } else {
                ok(predicate(value, sequence.getCurrent()));
            }
        }
    };

})(this);