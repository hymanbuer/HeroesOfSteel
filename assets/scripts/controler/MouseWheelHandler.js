
const {MOUSE_WHEEL_STEP} = require('ControlerConfig');

cc.Class({
    extends: cc.Component,

    onEnable () {
        this.node.on('mousewheel', this.onMouseWheel, this);
    },

    onDisable () {
        this.node.off('mousewheel', this.onMouseWheel, this);
    },

    onMouseWheel (event) {
        const step = event.getScrollY() > 0 ? MOUSE_WHEEL_STEP : -MOUSE_WHEEL_STEP
        // this.inputComp.scaleWorld(step);
        cc.log('MouseWhellHandler: scale world', step);
    },
});
