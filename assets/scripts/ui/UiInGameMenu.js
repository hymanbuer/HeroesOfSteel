
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
        cc.log('onClickWorldMap');
    },

    onClickOptions () {
        cc.log('onClickOptions');
    },

    onClickMainMenu () {
        cc.log('onClickMainMenu');
    },

    onTouchEnd () {
        this._resumePlay();
    },

    _resumePlay () {
        this.node.destroy();
    },
});
