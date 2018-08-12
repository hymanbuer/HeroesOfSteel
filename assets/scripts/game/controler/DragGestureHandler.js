
const {DRAG_SCALE_THRESHOLD_SQUARE} = require('ControlerConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        handlers: [cc.Component.EventHandler],
    },

    onEnable () {
        this.node.on('touchmove', this.onTouchMove, this, true);
        this.node.on('touchend', this.onTouchEnd, this, true);
    },

    onDisable () {
        this.node.off('touchmove', this.onTouchMove, this, true);
        this.node.off('touchend', this.onTouchEnd, this, true);
    },

    onTouchMove (event) {
        const touches = event.getTouches();
        if (touches.length > 1) return;

        const delta = touches[0].getDelta();
        if (delta.magSqr() >= DRAG_SCALE_THRESHOLD_SQUARE) {
            this.isTriggerMove = true;
            cc.Component.EventHandler.emitEvents(this.handlers, delta.neg());
        }
    },

    onTouchEnd (event) {
        if (this.isTriggerMove) {
            event.stopPropagationImmediate();
        }
        this.isTriggerMove = false;
    },
});
