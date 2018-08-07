
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

    rotateTo (target) {
        const start = cc.v2(this.node.x, this.node.y);
        const direction = cc.pSub(target, start);
        const radians = cc.pToAngle(direction);
        let degrees = -cc.radiansToDegrees(radians);
        
        let differ = degrees - this.node.rotation;
        differ %= 360;
        if (differ > 180) differ -= 360;
        if (differ < -180) differ += 360; 

        const rotateSpeed = 720 * this.timeScale;
        const duration = Math.abs(differ) / rotateSpeed;
        const rotate = cc.rotateBy(duration, differ);
        
        return new Promise(resolve => {
            const callFunc = cc.callFunc(resolve);
            this.node.runAction(cc.sequence(rotate, callFunc));
        });
    },

    moveTo (target) {
        const moveSpeed = 360 * this.timeScale;
        const start = cc.v2(this.node.x, this.node.y);
        const delta = cc.pSub(target, start);
        const duration = cc.pLength(delta) / moveSpeed;
        const move = cc.moveTo(duration, target);

        return new Promise(resolve => {
            const callFunc = cc.callFunc(resolve);
            this.node.runAction(cc.sequence(move, callFunc));
        });
    },

    stand () {
        if (this.skeleton.animation === 'Stand') return;
        this.skeleton.setAnimation(0, 'Stand', true);
        this.skeleton.timeScale = 1.0;
    },

    walk () {
        if (this.skeleton.animation === 'Walk') return;
        this.skeleton.setAnimation(0, 'Walk', true);
        this.skeleton.timeScale = this.timeScale;
    },

    stop () {
        this.node.stopAllActions();
        this.stand();
    }
});
