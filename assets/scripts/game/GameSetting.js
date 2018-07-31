
const exports = module.exports = {};

exports.enemySpeed = 1.0;
exports.playerSpeed = 1.0;
exports.isAutoGlom = true;
exports.isAutoFocus = true;
exports.isMusicOn = true;
exports.isSoundOn = true;
exports.isBloodSplatterOn = true;
exports.musicVolume = 100;
exports.soundVolume = 100;

exports.init = function (args) {
    for (const key in args || {}) {
        if (exports[key])
            exports[key] = args[key]; 
    }
};