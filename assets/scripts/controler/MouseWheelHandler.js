
const {MOUSE_WHEEL_STEP} = require('ControlerConfig');
const Dispatcher = require('ComponentEventDispatcher');
const {InputEvent} = require('ComponentEventType');

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
        Dispatcher.dispatch(InputEvent.SCALE_SCREEN, step);
    },
});
