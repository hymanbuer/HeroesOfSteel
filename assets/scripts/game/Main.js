
const LocalStorage = require('LocalStorage');
const GameSetting = require('GameSetting');

const Main = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
        
    },

    onLoad () {
        cc.game.addPersistRootNode(this.node);
        Main.instance = this;
        this._init();
    },

    onDestroy () {
        Main.instance = null;
        cc.game.removePersistRootNode(this.node);
    },

    start () {

    },

    update (dt) {

    },

    _init () {
        const setting = LocalStorage.getItem('GameSetting', {});
        GameSetting.init(setting);


    },
});
