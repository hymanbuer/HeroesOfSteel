
const {MIN_ZOOM_RATIO, MAX_ZOOM_RATIO} = require('ControlerConfig');
const Dispatcher = require('ComponentEventDispatcher');
const {InputEvent} = require('ComponentEventType');

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
        this.camera.zoomRatio = 1.0;
    },

    onEnable () {
        Dispatcher.on(InputEvent.DRAG_SCREEN, this.onMoveScreen, this);
        Dispatcher.on(InputEvent.SCALE_SCREEN, this.onScaleScreen, this);
    },

    onDisable () {
        Dispatcher.off(InputEvent.DRAG_SCREEN, this.onMoveScreen, this);
        Dispatcher.off(InputEvent.SCALE_SCREEN, this.onScaleScreen, this);
    },

    onScaleScreen (_, step) {
        this.camera.zoomRatio += step;
        this.camera.zoomRatio = cc.clampf(this.camera.zoomRatio, MIN_ZOOM_RATIO, MAX_ZOOM_RATIO);
    },

    onMoveScreen (_, delta) {
        delta = cc.pMult(delta, 1 / this.camera.zoomRatio);
        this.camera.node.x += delta.x;
        this.camera.node.y += delta.y;
    },
});
