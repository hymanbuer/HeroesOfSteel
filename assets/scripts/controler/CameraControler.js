
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
        Dispatcher.on(InputEvent.MOVE_WORLD, this.onMoveWorld, this);
        Dispatcher.on(InputEvent.SCALE_WORLD, this.onScaleWorld, this);
        Dispatcher.on(InputEvent.TOUCH_WORLD, this.onTouchWorld, this);
    },

    onDisable () {
        Dispatcher.off(InputEvent.MOVE_WORLD, this.onMoveWorld, this);
        Dispatcher.off(InputEvent.SCALE_WORLD, this.onScaleWorld, this);
        Dispatcher.off(InputEvent.TOUCH_WORLD, this.onTouchWorld, this);
    },

    onScaleWorld (_, step) {
        this.camera.zoomRatio += step;
        this.camera.zoomRatio = cc.clampf(this.camera.zoomRatio, MIN_ZOOM_RATIO, MAX_ZOOM_RATIO);
    },

    onMoveWorld (_, delta) {
        delta = cc.pMult(delta, 1 / this.camera.zoomRatio);
        this.camera.node.x += delta.x;
        this.camera.node.y += delta.y;
    },

    onTouchWorld (_, screenLocation) {
        cc.log('onTouchWorld', screenLocation);
    },
});
