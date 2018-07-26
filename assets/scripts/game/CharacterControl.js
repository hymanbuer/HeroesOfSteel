
cc.Class({
    extends: cc.Component,

    properties: {
        skeleton: sp.Skeleton,
    },

    onLoad () {
        
    },

    start () {
        this.timeScale = 1.0;
    },

    followPath (posList = [], callback) {
        const asyncFuncs = [];
        for (const pos of posList) {
            const fns = [
                ()=> new Promise(resolve => this.rotateTo(pos, resolve)),
                ()=> Promise.resolve(this._walk()),
                ()=> new Promise(resolve => this.moveTo(pos, resolve)),
            ];
            asyncFuncs.push(fns);
        }

        const timeline = co.timeline(asyncFuncs)
        this.node.stopAllActions();
        timeline().then(()=> {
            this._stand();
            if (typeof callback === 'function') callback();
        });
    },

    rotateTo (target, callback) {
        const action = this._rotateTo(target, callback);
        this.node.runAction(action);
    },

    moveTo (target, callback) {
        const action = this._moveTo(target, callback);
        this.node.runAction(action);
    },

    _rotateTo (target, callback) {
        const start = cc.v2(this.node.x, this.node.y);
        const direction = cc.pSub(target, start);
        const radians = cc.pToAngle(direction);
        let degrees = -cc.radiansToDegrees(radians);
        
        let differ = degrees - this.node.rotation;
        differ %= 360;
        if (differ > 180) differ -= 360;
        if (differ < -180) differ += 360; 

        if (Math.abs(differ) <= 8)
            return cc.callFunc(callback ? callback : ()=>{});

        const rotateSpeed = 720 * this.timeScale;
        const duration = Math.abs(differ) / rotateSpeed;
        const rotate = cc.rotateBy(duration, differ);

        return callback ? cc.sequence(rotate, cc.callFunc(callback)) : rotate;
    },

    _moveTo (target, callback) {
        const moveSpeed = 360 * this.timeScale;
        const start = cc.v2(this.node.x, this.node.y);
        const delta = cc.pSub(target, start);
        const duration = cc.pLength(delta) / moveSpeed;
        const move =  cc.moveTo(duration, target)

        return callback ? cc.sequence(move, cc.callFunc(callback)) : move;
    },

    _stand () {
        if (this.skeleton.animation === 'Stand') return;
        this.skeleton.setAnimation(0, 'Stand', true);
        this.skeleton.timeScale = 1.0;
    },

    _walk () {
        if (this.skeleton.animation === 'Walk') return;
        this.skeleton.setAnimation(0, 'Walk', true);
        this.skeleton.timeScale = this.timeScale;
    },
});
