
function getMinRotationBy (start, target, originRotation = 0) {
    const direction = target.sub(start);
    const radians = Math.atan2(direction.y, direction.x);
    let degrees = -cc.misc.radiansToDegrees(radians);
    
    let differ = degrees - originRotation;
    differ %= 360;
    if (differ > 180) differ -= 360;
    if (differ < -180) differ += 360;

    return differ;
}

cc.Class({
    extends: cc.Component,

    properties: {
        endPos: cc.Vec2,
        moveSpeed: 480,
        timeScale: 1.0,
    },

    start () {
        const distance = this.endPos.sub(this.node.position).mag();
        const speed = this.moveSpeed * this.timeScale;
        const move = cc.moveTo(distance/speed, this.endPos);
        this.node.runAction(cc.sequence(move, cc.callFunc(()=> {
            this.node.destroy();
            if (this.finishCallback) {
                this.finishCallback();
            }
        })));

        const rotation = getMinRotationBy(this.node.position, this.endPos, this.node.rotation);
        this.node.rotation = rotation;
    },
});
