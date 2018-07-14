
function getAnimationNameByPercent(percent) {
    percent = cc.clampf(percent, 0, 100);
    percent = Math.floor(percent / 10);
    return `${percent*10} Percent`;
}

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        tips: cc.Label,
        progress: sp.Skeleton,
    },

    onLoad () {
        this.init();
        this.node.on('touchend', this.onTouchEnd, this);
    },

    init (params = {}) {
        this.title.string = params.title || '';
        this.tips.string = params.tips || '';
        this.setPercent(params.percent || 0);
    },

    setPercent (percent) {
        const name = getAnimationNameByPercent(percent);
        if (this.progress.animation !== name) {
            const oldEntry = this.progress.getCurrent(0);
            const newEntry = this.progress.setAnimation(0, name, true);
            newEntry.trackTime = oldEntry.trackTime;
        }
    },

    onTouchEnd () {
        this.node.destroy();
    }
});
