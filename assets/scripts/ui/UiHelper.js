
const UiHelper = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
        canvas: cc.Node,
        uiMaskPrefab: cc.Prefab,
        loadingTipsPrefab: cc.Prefab,
    },

    onLoad () {
        UiHelper.instance = this;
        this.canvas = cc.director.getScene().getChildByName('Canvas');
    },

    onDestroy () {
        UiHelper.instance = null;
    },

    showUi (uiPrefabPath) {
        const uiMask = this._addMask();
        this.scheduleOnce(this._addTips, 0.05);
        return this._loadPrefab(uiPrefabPath, uiMask);
    },

    _loadPrefab(path, uiMask) {
        const success = uiPrefab => {
            const ui = cc.instantiate(uiPrefab);
            this.canvas.addChild(ui, Number.MAX_SAFE_INTEGER);
            this._removeTips();

            const oldDestroy = ui.destroy;
            ui.destroy = () => {
                uiMask.destroy();
                oldDestroy.call(ui, ...arguments);
            };

            return ui;
        };

        const uiPrefab = cc.loader.getRes(path, cc.Prefab);
        if (uiPrefab)
            return new Promise((resolve, reject) => {
                const ui = success(uiPrefab);
                resolve(ui);
            });
        else
            return new Promise((resolve, reject) => {
                cc.loader.loadRes(path, cc.Prefab, (err, uiPrefab) => {
                    if (err) {
                        uiMask.destroy();
                        this._removeTips();
                        return reject(err);
                    }
                    
                    const ui = success(uiPrefab);
                    resolve(ui);
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
