
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
        this.title.string = '';
        this.tips.string = '';
        this._setPercent(0);

        this.resources = [];
        this.resources.push({uuid: UUID.GameScene});
    },

    start () {
        this._add('295fd607-9328-45c0-a6f3-ad4bf3d9ba48');
        
        this._startLoad();
    },

    _add (uuid) {
        this.resources.push({uuid});
    },

    _startLoad () {
        const progress = (count, totalCount, asset) => {
            const percent = count / totalCount * 100;
            this._setPercent(percent);
            // cc.log('progress:', count, totalCount, asset.id);
        };
        const complete = (err, asset) => {
            if (err) throw new Error(err);
            // cc.log('complete:', asset);
            this._runScene('game');
        };
        cc.loader.load(this.resources, progress, complete);
    },

    _setPercent (percent) {
        const name = getAnimationNameByPercent(percent);
        if (this.progress.animation !== name) {
            const oldEntry = this.progress.getCurrent(0);
            const newEntry = this.progress.setAnimation(0, name, true);
            newEntry.trackTime = oldEntry.trackTime;
        }
    },

    _runScene (name) {
        cc.director.loadScene(name, () => {
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
