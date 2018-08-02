
const LoaderHelper = require('CCLoaderHelper');

const UiHelper = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
        uiMaskPrefab: cc.Prefab,
        loadingTipsPrefab: cc.Prefab,
    },

    onLoad () {
        if (UiHelper.instance) return;
        UiHelper.instance = this;
    },

    onDestroy () {
        // UiHelper.instance = null;
    },

    showUi (uiPrefabPath, options = {}) {
        let uiMask = null;
        if (!options.hideMask)
            uiMask = this._addMask();

        if (!options.hideTips)
            this.scheduleOnce(this._addTips, 0.05);

        return this._loadPrefab(uiPrefabPath, uiMask);
    },

    _loadPrefab(uiPrefabPath, uiMask) {
        return new Promise((resolve, reject) => {
            const promise = LoaderHelper.loadResByUrl(uiPrefabPath, cc.Prefab);
            promise.then(uiPrefab => {
                const ui = cc.instantiate(uiPrefab);
                this._getCanvas().addChild(ui, Number.MAX_SAFE_INTEGER);
                this._removeTips();

                const oldDestroy = ui.destroy;
                ui.destroy = () => {
                    if (uiMask)
                        uiMask.destroy();

                    oldDestroy.call(ui, ...arguments);
                    if (typeof ui.ondestroy === 'function')
                        ui.ondestroy();
                };

                resolve(ui);
            });

            promise.catch(err => {
                if (uiMask)
                    uiMask.destroy();
                this._removeTips();

                reject(err);
            });
        });
    },

    _addMask () {
        const uiMask = cc.instantiate(this.uiMaskPrefab);
        this._getCanvas().addChild(uiMask, Number.MAX_SAFE_INTEGER);
        return uiMask;
    },

    _addTips () {
        this.loadingTips = cc.instantiate(this.loadingTipsPrefab);
        this._getCanvas().addChild(this.loadingTips, Number.MAX_SAFE_INTEGER);
    },

    _removeTips() {
        if (cc.isValid(this.loadingTips)) {
            this.loadingTips.destroy();
            this.loadingTips = null;
        }
        this.unschedule(this._addTips);
    },

    _getCanvas () {
        return cc.director.getScene().getChildByName('Canvas');
    },
});
