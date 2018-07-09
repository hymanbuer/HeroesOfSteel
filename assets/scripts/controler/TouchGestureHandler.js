
cc.Class({
    extends: cc.Component,

    onEnable () {
        this.node.on('touchend', this.onTouchEnd, this);
    },

    onDisable () {
        this.node.off('touchend', this.onTouchEnd, this);
    },

    onTouchEnd (event) {
        const touches = event.getTouches();
        if (touches.length > 1) return;

        const location = touches[0].getLocation();
        // this.inputComp.touchWorld(location);
        cc.log('TouchGestureHandler: touch world', location);
    },
});
