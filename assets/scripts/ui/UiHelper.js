
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
        this._addMask();
        this.scheduleOnce(this._addTips, 0.05);
        return this._loadPrefab(uiPrefabPath);
    },

    _loadPrefab(path) {
        const self = this;
        const success = uiPrefab => {
            const ui = cc.instantiate(uiPrefab);
            self.canvas.addChild(ui, Number.MAX_SAFE_INTEGER);
            self._removeTips();

            const oldDestroy = ui.destroy;
            ui.destroy = function () {
                self._removeMask();
                oldDestroy.call(ui, ...arguments);
            };

            return ui;
        };

        const uiPrefab = cc.loader.getRes(path, cc.Prefab);
        if (uiPrefab)
            return new Promise(function (resolve, reject) {
                const ui = success(uiPrefab);
                resolve(ui);
            });
        else
            return new Promise(function (resolve, reject) {
                cc.loader.loadRes(path, cc.Prefab, function (err, uiPrefab) {
                    if (err) {
                        self._removeMask();
                        self._removeTips();
                        return reject(err);
                    }
                    
                    const ui = success(uiPrefab);
                    resolve(ui);
                });
            });
    },

    _addMask () {
        this.uiMask = cc.instantiate(this.uiMaskPrefab);
        this.canvas.addChild(this.uiMask, Number.MAX_SAFE_INTEGER);
    },

    _addTips () {
        this.loadingTips = cc.instantiate(this.loadingTipsPrefab);
        this.canvas.addChild(this.loadingTips, Number.MAX_SAFE_INTEGER);
    },

    _removeMask() {
        if (cc.isValid(this.uiMask)) {
            this.uiMask.destroy();
            this.uiMask = null;
        }
    },

    _removeTips() {
        if (cc.isValid(this.loadingTips)) {
            this.loadingTips.destroy();
            this.loadingTips = null;
        }
        this.unschedule(this._addTips);
    }
});
