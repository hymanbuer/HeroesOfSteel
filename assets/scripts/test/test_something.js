


cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        
    },

    start () {
        this.node.on('savename', this.onSaveName, this, true);
    },

    onSaveName (event) {
        cc.log(event);
    }
});
