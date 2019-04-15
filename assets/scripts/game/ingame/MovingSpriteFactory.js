
function createSprite(spriteFrame) {
    const node = new cc.Node();
    const sprite = node.addComponent(cc.Sprite);
    sprite.trim = cc.Sprite.Type.SIMPLE;
    sprite.sizeMode = cc.Sprite.SizeMode.RAW;
    sprite.spriteFrame = spriteFrame;
    return node;
}

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

const MovingSpriteFactory = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
        spriteAtlas: cc.SpriteAtlas,
        container: cc.Node,
    },

    onLoad () {
        MovingSpriteFactory.instance = this;
    },

    onDestroy () {
        MovingSpriteFactory.instance = null;
    },

    addMovingSprite (spriteName, from, to, speed) {
        from = this.container.convertToNodeSpaceAR(from);
        to = this.container.convertToNodeSpaceAR(to);

        const spriteFrame = this.spriteAtlas.getSpriteFrame(spriteName);
        const node = createSprite(spriteFrame);
        this.container.addChild(node);

        const rotation = getMinRotationBy(from, to);
        const distance = to.sub(from).mag();
        const move = cc.moveTo(distance/speed, to);
        node.rotation = rotation;
        node.position = from;

        return new Promise(resolve => {
            node.runAction(cc.sequence(move, cc.callFunc(()=> {
                node.destroy();
                resolve();
            })));
        });
    },

});
