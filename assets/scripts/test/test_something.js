
const UiHelper = require('UiHelper');

cc.Class({
    extends: cc.Component,

    properties: {
        sprite: cc.Sprite,
    },

    onLoad () {
        
    },

    start () {
        
    },

    show (_, path) {
        const p = UiHelper.instance.showUi(path);
        const self = this;
        p.then(ui => {
            cc.log(ui);
            self.scheduleOnce(function () {
                ui.destroy();
            }, 3);
        });
        p.catch(err => {
            cc.log(err);
        });
    }

    // update (dt) {},
});
