
const {DRAG_SCALE_THRESHOLD_SQUARE, TOUCH_SCALE_FACTOR} = require('ControlerConfig');
const Dispatcher = require('ComponentEventDispatcher');
const {InputEvent} = require('ComponentEventType');

cc.Class({
    extends: cc.Component,

    onEnable () {
        this.node.on('touchmove', this.onTouchMove, this);
    },

    onDisable () {
        this.node.off('touchmove', this.onTouchMove, this);
    },

    onTouchMove (event) {
        const touches = event.getTouches();
        if (touches.length < 2) return;

        event.stopPropagationImmediate();
        const touch1 = touches[0], touch2 = touches[1];
        const previous1 = touch1.getPreviousLocation(), previous2 = touch2.getPreviousLocation();
        const current1 = touch1.getLocation(), current2 = touch2.getLocation();
        const previousDistanceSq = cc.pDistanceSQ(previous1, previous2);
        const currentDistanceSq = cc.pDistanceSQ(current1, current2);
        if (Math.abs(currentDistanceSq - previousDistanceSq) >= DRAG_SCALE_THRESHOLD_SQUARE) {
            const step = (currentDistanceSq / previousDistanceSq - 1) * TOUCH_SCALE_FACTOR;
            Dispatcher.dispatch(InputEvent.SCALE_WORLD, step);
        }
    },
});
