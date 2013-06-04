    // Check for AMD
    if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
        window.Ix = Ix;
        return define(function () {
            return Ix;
        });
    } else if (freeExports) {
        if (typeof module == 'object' && module && module.exports == freeExports) {
            module.exports = Ix;
        } else {
            freeExports = Ix;
        }
    } else {
        window.Ix = Ix;
    }
    