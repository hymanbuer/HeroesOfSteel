
const LoaderHelper = require('CCLoaderHelper');

const UiHelper = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
        canvas: {
            get () { return cc.director.getScene().getChildByName('Canvas'); }
        },
        uiMaskPrefab: cc.Prefab,
        loadingTipsPrefab: cc.Prefab,
    },

    onLoad () {
        UiHelper.instance = this;
    },

    onDestroy () {
        // UiHelper.instance = null;
    },

    showUi (uiPrefabPath) {
        const uiMask = this._addMask();
        this.scheduleOnce(this._addTips, 0.05);
        return this._loadPrefab(uiPrefabPath, uiMask);
    },

    _loadPrefab(uiPrefabPath, uiMask) {
        return new Promise((resolve, reject) => {
            const promise = LoaderHelper.loadResByUrl(uiPrefabPath, cc.Prefab);
            promise.then(uiPrefab => {
                const ui = cc.instantiate(uiPrefab);
                this.canvas.addChild(ui, Number.MAX_SAFE_INTEGER);
                this._removeTips();

                const oldDestroy = ui.destroy;
                ui.destroy = () => {
                    uiMask.destroy();
                    oldDestroy.call(ui, ...arguments);
                    if (typeof ui.ondestroy === 'function')
                        ui.ondestroy();
                };

                resolve(ui);
            });

            promise.catch(err => {
                uiMask.destroy();
                this._removeTips();

                reject(err);
            });
        });
    },

    _addMask () {
        const uiMask = cc.instantiate(this.uiMaskPrefab);
        this.canvas.addChild(uiMask, Number.MAX_SAFE_INTEGER);
        return uiMask;
    },

    _addTips () {
        this.loadingTips = cc.instantiate(this.loadingTipsPrefab);
        this.canvas.addChild(this.loadingTips, Number.MAX_SAFE_INTEGER);
    },

    _removeTips() {
        if (cc.isValid(this.loadingTips)) {
            this.loadingTips.destroy();
            this.loadingTips = null;
        }
        this.unschedule(this._addTips);
    }
});
