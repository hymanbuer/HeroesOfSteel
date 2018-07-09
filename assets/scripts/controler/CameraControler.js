
const {MIN_ZOOM_RATIO, MAX_ZOOM_RATIO} = require('ControlerConfig');

cc.Class({
    extends: cc.Component,
    editor: {
        requireComponent: cc.Camera,
    },

    properties: {
        
    },

    onLoad () {},

    start () {
        this.camera = this.node.getComponent(cc.Camera);
    },

    scaleWorld (step) {
        this.camera.zoomRatio += step;
        this.camera.zoomRatio = cc.clampf(this.camera.zoomRatio, MIN_ZOOM_RATIO, MAX_ZOOM_RATIO);
    },

    moveWorld (delta) {
        delta = cc.pMult(delta, 1 / this.camera.zoomRatio);
        this.camera.node.x += delta.x;
        this.camera.node.y += delta.y;
    },
});
