
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

        let nodePos = this.node.convertTouchToNodeSpaceAR(touches[0]);
        nodePos = cc.pMult(nodePos, 1 / this.camera.zoomRatio);

        const cameraPos = cc.v2(this.camera.node.x, this.camera.node.y);
        const worldPos = cc.pAdd(cameraPos, nodePos);
        cc.Component.EventHandler.emitEvents(this.handlers, worldPos);
    },
});
