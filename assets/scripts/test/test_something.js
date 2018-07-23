
cc.Class({
    extends: cc.Component,

    properties: {
        hero: sp.Skeleton,
    },

    onLoad () {
        this.node.on('touchend', this.onTouchEnd, this);
    },

    start () {
        this.timeScale = 1.0;
    },

    onTouchEnd (event) {
        const touches = event.getTouches();
        if (touches.length > 1) return;

        let pos = this.node.convertTouchToNodeSpaceAR(touches[0]);
        
        const actions = [];
        this.hero.setAnimation(0, 'Stand', true);
        this.hero.timeScale = 1.0;
        actions.push(this.rotateTo(pos));
        actions.push(cc.callFunc(()=> {
            this.hero.setAnimation(0, 'Walk', true);
            this.hero.timeScale = this.timeScale;
        }));
        actions.push(this.moveTo(pos));
        actions.push(cc.callFunc(()=> {
            this.hero.setAnimation(0, 'Stand', true);
            this.hero.timeScale = 1.0;
        }));
        this.hero.node.stopAllActions();
        this.hero.node.runAction(cc.sequence(actions));
    },

    rotateTo (target) {
        const REF = cc.v2(0, -1);
        const start = cc.v2(this.hero.node.x, this.hero.node.y);
        const direction = cc.pSub(target, start);
        const radians = cc.pAngleSigned(direction, REF);
        const degrees = cc.radiansToDegrees(radians);

        let differ = degrees - this.hero.node.rotation;
        differ %= 360;
        if (differ > 180) differ -= 360;
        if (differ < -180) differ += 360; 

        const rotateSpeed = 720 * this.timeScale;
        const duration = Math.abs(differ) / rotateSpeed;
        return cc.rotateBy(duration, differ)
    },

    moveTo (target) {
        const moveSpeed = 360 * this.timeScale;
        const start = cc.v2(this.hero.node.x, this.hero.node.y);
        const delta = cc.pSub(target, start);
        const duration = cc.pLength(delta) / moveSpeed;
        return cc.moveTo(duration, target)
    }
});
 