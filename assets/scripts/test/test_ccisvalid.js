
cc.Class({
    extends: cc.Component,

    properties: {
        sprite: cc.Sprite,
    },

    onLoad () {
        cc.log(cc.isValid(this.sprite));
    },

    start () {
        cc.log(cc.isValid(this.sprite));
        this.node.removeComponent(this.sprite);
        cc.log(cc.isValid(this.sprite));
        this.scheduleOnce(function () {
            cc.log(cc.isValid(this.sprite));
        }, 0);
    },

    // update (dt) {},
});
