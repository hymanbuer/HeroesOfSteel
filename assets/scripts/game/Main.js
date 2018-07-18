
const Main = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
        
    },

    onLoad () {
        cc.game.addPersistRootNode(this.node);
        Main.instance = this;
    },

    onDestroy () {
        Main.instance = null;
        cc.game.removePersistRootNode(this.node);
    },

    start () {

    },

    update (dt) {

    },
});
