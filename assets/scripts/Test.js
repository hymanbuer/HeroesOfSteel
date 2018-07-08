
const Loading = require('Loading');

cc.Class({
    extends: cc.Component,

    properties: {
        loadingNode: cc.Node,
    },

    start () {
        this.stateTime = 0;
    },

    update (dt) {
        const loading = this.loadingNode.getComponent(Loading);
        this.stateTime += dt;
        loading.setPercent(this.stateTime/5*100);
    },
});
