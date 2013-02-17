(function (root, factory) {
    var freeExports = typeof exports == 'object' && exports &&
    (typeof root == 'object' && root && root == root.global && (window = root), exports);

    // Because of build optimizers
    if (typeof define === 'function' && define.amd) {
        define(['l2o', 'exports'], function (L2O, exports) {
            root.L2O = factory(root, exports, L2O);
            return root.L2O;
        });
    } else if (typeof module == 'object' && module && module.exports == freeExports) {
        module.exports = factory(root, module.exports, require('./l2o'));
    } else {
        root.Rx = factory(root, {}, root.L2O);
    }
}(this, function (global, exp, root, undefined) {

