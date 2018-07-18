
const UUID = require('UUID');

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
        cc.game.addPersistRootNode(this.node);
        this.init();
    },

    start () {
        const info = {uuid: UUID.GameScene, type: 'scene'};
        const progress = (count, totalCount, _) => {
            const percent = count / totalCount * 100
            this.setPercent(percent);
        };
        const complete = (err, asset) => {
            if (err) throw new Error(err);
            this._runScene(asset.scene)
        };
        cc.loader.load(info, progress, complete);
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

    _runScene (scene) {
        cc.director.runScene(scene, () => {
            const animation = this.getComponent(cc.Animation);
            animation.play();
            animation.on('finished', this._destroy, this);
        });
    },

    _destroy () {
        cc.game.removePersistRootNode(this.node);
        this.node.destroy();
    },
});
