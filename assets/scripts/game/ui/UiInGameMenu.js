
const UiHelper = require('UiHelper');

cc.Class({
    extends: cc.Component,

    properties: {
        info: cc.Label,
    },

    onLoad () {
        this.node.on('touchend', this.onTouchEnd, this);
    },

    onClickResumePlay () {
        this._resumePlay();
    },

    onClickQuestLog () {
        cc.log('onClickQuestLog');
    },

    onClickWorldMap () {
        UiHelper.instance.showUi('prefabs/game/ui_world_map');
    },

    onClickLibrary () {
        cc.log('onClickLibrary');
    },

    onClickOptions () {
        UiHelper.instance.showUi('prefabs/main/ui_options');
    },

    onClickMainMenu () {
        cc.director.loadScene('main');
    },

    onTouchEnd () {
        this._resumePlay();
    },

    _resumePlay () {
        this.node.destroy();
    },
});
