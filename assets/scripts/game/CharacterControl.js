
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

    followPath (posList = []) {
        const gotoNext = index => {
            if (index >= posList.length) {
                this._stand();
                return;
            }

            const pos = posList[index];
            const actions = [];
            const spawn = cc.spawn(this.rotateTo(pos),
                cc.callFunc(()=> this._walk()),
                this.moveTo(pos));
            actions.push(spawn);
            actions.push(cc.callFunc(()=> gotoNext(index + 1)));
            this.node.runAction(cc.sequence(actions));
        };

        this.node.stopAllActions();
        gotoNext(0);
    },

    rotateTo (target) {
        const start = cc.v2(this.node.x, this.node.y);
        const direction = cc.pSub(target, start);
        const radians = cc.pToAngle(direction);
        let degrees = -cc.radiansToDegrees(radians);
        
        let differ = degrees - this.node.rotation;
        differ %= 360;
        if (differ > 180) differ -= 360;
        if (differ < -180) differ += 360; 

        if (Math.abs(differ) <= 8)
            return cc.callFunc(()=>{});

        const rotateSpeed = 720 * this.timeScale;
        const duration = Math.abs(differ) / rotateSpeed;
        return cc.rotateBy(duration, differ)
    },

    moveTo (target) {
        const moveSpeed = 360 * this.timeScale;
        const start = cc.v2(this.node.x, this.node.y);
        const delta = cc.pSub(target, start);
        const duration = cc.pLength(delta) / moveSpeed;
        return cc.moveTo(duration, target)
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
