
const UUID = require('UUID');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        
    },

    start () {
        const info = {uuid: UUID.GameScene, type: 'scene'};
        const progress = (count, totalCount, item) => {
            cc.log(count, totalCount, item);
        };
        const complete = (err, assert) => {
            cc.log(err, assert);
            if (assert.scene instanceof cc.Scene)
                cc.director.runScene(assert.scene);
        };
        cc.loader.load(info, progress, complete);
    },

    onSaveName (event) {
        cc.log(event);
    }
});
 