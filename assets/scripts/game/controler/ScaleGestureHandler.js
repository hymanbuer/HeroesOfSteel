
const {DRAG_SCALE_THRESHOLD_SQUARE, TOUCH_SCALE_FACTOR} = require('ControlerConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        handlers: [cc.Component.EventHandler],
    },

    onEnable () {
        this.node.on('touchmove', this.onTouchMove, this, true);
    },

    onDisable () {
        this.node.off('touchmove', this.onTouchMove, this, true);
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
            cc.Component.EventHandler.emitEvents(this.handlers, step);
        }
    },
});
