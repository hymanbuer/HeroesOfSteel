
const {MOUSE_WHEEL_STEP} = require('ControlerConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        handlers: [cc.Component.EventHandler],
    },

    onEnable () {
        this.node.on('mousewheel', this.onMouseWheel, this);
    },

    onDisable () {
        this.node.off('mousewheel', this.onMouseWheel, this);
    },

    onMouseWheel (event) {
        const step = event.getScrollY() > 0 ? MOUSE_WHEEL_STEP : -MOUSE_WHEEL_STEP
        cc.Component.EventHandler.emitEvents(this.handlers, step);
    },
});
