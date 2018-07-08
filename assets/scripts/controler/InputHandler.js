
const MAX_ZOOM_RATIO = 2;
const MIN_ZOOM_RATIO = 0.25;
const MOUSE_WHEEL_STEP = 0.1;
const TOUCH_SCALE_FACTOR = 0.25;
const DRAG_SCALE_THRESHOLD_SQUARE = 2*2;

class BaseHandler {
    constructor (inputComp) {
        this.inputComp = inputComp;
        this.onEvents();
    }
    onEvents () {}
    offEvents () {}
}

class MouseWheelHandler extends BaseHandler {
    onEvents () {
        this.inputComp.node.on('mousewheel', this.onMouseWheel, this);
    }

    offEvents () {
        this.inputComp.node.off('mousewheel', this.onMouseWheel, this);
    }

    onMouseWheel (event) {
        const step = event.getScrollY() > 0 ? MOUSE_WHEEL_STEP : -MOUSE_WHEEL_STEP
        this.inputComp.scaleWorld(step);
    }
}

class ScaleGestureHandler extends BaseHandler {
    onEvents () {
        this.inputComp.node.on('touchmove', this.onTouchMove, this);
    }

    offEvents () {
        this.inputComp.node.off('touchmove', this.onTouchMove, this);
    }

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
            this.inputComp.scaleWorld(step);
        }
    }
}

class DragGestureHandler extends BaseHandler {
    onEvents () {
        this.inputComp.node.on('touchmove', this.onTouchMove, this);
        this.inputComp.node.on('touchend', this.onTouchEnd, this);
    }

    offEvents () {
        this.inputComp.node.off('touchmove', this.onTouchMove, this);
        this.inputComp.node.off('touchend', this.onTouchEnd, this);
    }

    onTouchMove (event) {
        const touches = event.getTouches();
        if (touches.length > 1) return;

        const delta = touches[0].getDelta();
        if (cc.pLengthSQ(delta) >= DRAG_SCALE_THRESHOLD_SQUARE) {
            this.inputComp.moveWorld(cc.pNeg(delta));
            this.isTriggerMove = true;
        }
    }

    onTouchEnd (event) {
        if (this.isTriggerMove) {
            event.stopPropagationImmediate();
        }
        this.isTriggerMove = false;
    }
}

class TouchGestureHandler extends BaseHandler {
    onEvents () {
        this.inputComp.node.on('touchend', this.onTouchEnd, this);
    }

    offEvents () {
        this.inputComp.node.off('touchend', this.onTouchEnd, this);
    }

    onTouchEnd (event) {
        const touches = event.getTouches();
        if (touches.length > 1) return;

        const location = touches[0].getLocation();
        this.inputComp.touchWorld(location);
    }
}

cc.Class({
    extends: cc.Component,

    properties: {
        camera: cc.Camera,
    },

    onLoad () {
        this.mouseWheelHandler = new MouseWheelHandler(this);
        this.scaleGestureHandler = new ScaleGestureHandler(this);
        this.dragGestureHandler = new DragGestureHandler(this);
        this.touchGestureHandler = new TouchGestureHandler(this);
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

    touchWorld (screenLocation) {
        cc.log('touch: ', screenLocation.x, screenLocation.y);
    },
});
