
cc.Class({
    extends: cc.Component,

    properties: {
        handlers: [cc.Component.EventHandler],
        camera: cc.Camera,
    },

    onEnable () {
        this.node.on('touchend', this.onTouchEnd, this);
    },

    onDisable () {
        this.node.off('touchend', this.onTouchEnd, this);
    },

    onTouchEnd (event) {
        const touches = event.getTouches();
        if (touches.length > 1) return;

        let nodePos = this.node.convertToNodeSpaceAR(touches[0].getLocation());
        nodePos = nodePos.mul(1 / this.camera.zoomRatio);

        const cameraPos = cc.v2(this.camera.node.x, this.camera.node.y);
        const worldPos = cameraPos.add(nodePos);
        cc.Component.EventHandler.emitEvents(this.handlers, worldPos);
    },
});
