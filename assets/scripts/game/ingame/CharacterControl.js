
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
        const direction = target.sub(start);
        const radians = Math.atan2(direction.y, direction.x);
        let degrees = -cc.misc.radiansToDegrees(radians);
        
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
        const delta = target.sub(start);
        const duration = delta.mag() / moveSpeed;
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
    },

    play (animationName) {
        if (this.skeleton.animation === animationName)
            return Promise.reject(`already play: ${animationName}`);

        return new Promise(resolve => {
            const trackEntry = this.skeleton.setAnimation(0, animationName, false);
            this.skeleton.timeScale = 1.0;
            this.skeleton.setTrackCompleteListener(trackEntry, ()=> {
                this.skeleton.setAnimation(0, 'Stand', true);
                resolve();
            });
        });
    },

    getBonePosition (boneName) {
        const bone = this.skeleton.findBone(boneName);
        if (!bone) return cc.v2(0, 0);

        const offset = cc.v2(bone.x, bone.y);
        return this.skeleton.node.convertToWorldSpaceAR(offset);
    }
});
