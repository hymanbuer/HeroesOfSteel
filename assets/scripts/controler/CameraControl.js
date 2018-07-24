
const {MIN_ZOOM_RATIO, MAX_ZOOM_RATIO} = require('ControlerConfig');

const FOLLOW_RATIO = 0.05;
const FOLLOW_THRESHOLD = 64;
const UNFOLLOW_THRESHOLD = 16;

const MOVE_SPEED = 480;

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

    lateUpdate (dt) {
        // if (this.targetPos instanceof cc.Vec2) {
        //     if (Math.abs(this.node.x - this.targetPos.x) >= FOLLOW_THRESHOLD
        //         || Math.abs(this.node.y - this.targetPos.y) >= FOLLOW_THRESHOLD) {
        //         this._isFollowing = true;
        //     }
        //     if (this._isFollowing) {
        //         this.node.position = this.node.position.lerp(this.targetPos, FOLLOW_RATIO);
        //         if (cc.pDistance(this.targetPos, this.node.position) <= UNFOLLOW_THRESHOLD) {
        //             this._isFollowing = false;
        //         }
        //     }
        // }
    },

    placeOn (pos) {
        this.node.position = pos;
    },

    moveOn (pos, callback) {
        // this.targetPos = pos;
        // this._isFollowing = true;

        const distance = cc.pDistance(pos, this.node.position);
        const duration = distance / MOVE_SPEED;
        const move = cc.moveTo(duration, pos);
        this.node.stopAllActions();
        if (typeof callback === 'function')
            this.node.runAction(cc.sequence(move, cc.callFunc(callback)));
        else
            this.node.runAction(move);
    },

    onScaleScreen (step) {
        this.camera.zoomRatio += step;
        this.camera.zoomRatio = cc.clampf(this.camera.zoomRatio, MIN_ZOOM_RATIO, MAX_ZOOM_RATIO);
    },

    onMoveScreen (delta) {
        delta = cc.pMult(delta, 1 / this.camera.zoomRatio);
        this.camera.node.x += delta.x;
        this.camera.node.y += delta.y;

        // this.targetPos = null;

        this.node.stopAllActions();
    },
});
