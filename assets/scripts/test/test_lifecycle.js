
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    ctor () {
        cc.log('Test -> ctor');
    },

    onLoad () {
        cc.log('Test -> onLoad');
    },

    start () {
        cc.log('Test -> start');
    },

    update (dt) {
        if (!this.callUpdate) {
            this.callUpdate = true;
            cc.log('Test -> update');
        }
    },

    lateUpdate (dt) {
        if (!this.callLateUpdate) {
            this.callLateUpdate = true;
            cc.log('Test -> lateUpdate');
        }
    },

    onDestroy () {
        cc.log('Test -> onDestroy');
    },

    onEnable () {
        cc.log('Test -> onEnable');
        this.callUpdate = false;
        this.callLateUpdate = false;
    },

    onDisable () {
        cc.log('Test -> onDisable');
    },
});
