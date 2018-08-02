
const {DRAG_SCALE_THRESHOLD_SQUARE} = require('ControlerConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        handlers: [cc.Component.EventHandler],
    },

    onEnable () {
        this.node.on('touchmove', this.onTouchMove, this);
        this.node.on('touchend', this.onTouchEnd, this);
    },

    onDisable () {
        this.node.off('touchmove', this.onTouchMove, this);
        this.node.off('touchend', this.onTouchEnd, this);
    },

    onTouchMove (event) {
        const touches = event.getTouches();
        if (touches.length > 1) return;

        const delta = touches[0].getDelta();
        if (cc.pLengthSQ(delta) >= DRAG_SCALE_THRESHOLD_SQUARE) {
            this.isTriggerMove = true;
            cc.Component.EventHandler.emitEvents(this.handlers, cc.pNeg(delta));
        }
    },

    onTouchEnd (event) {
        if (this.isTriggerMove) {
            event.stopPropagationImmediate();
        }
        this.isTriggerMove = false;
    },
});
