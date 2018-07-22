
cc.Class({
    extends: cc.Component,
    editor: {
        requireComponent: sp.Skeleton,
    },

    properties: {
        skeleton: sp.Skeleton,
    },

    onLoad () {
        this.skeleton = this.node.getComponent(sp.Skeleton);
        this.skeleton.setAnimation(0, 'stand', true);
    },

    start () {

    },

    moveTo (pos, callback) {
        const actions = [];
        
    }
});
