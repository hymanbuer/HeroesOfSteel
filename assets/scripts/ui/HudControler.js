
const UiHelper = require('UiHelper');

cc.Class({
    extends: cc.Component,

    properties: {
        btnInfo: cc.Node,
        talentsPanel: cc.Node,
    },

    onLoad () {

    },

    start () {

    },

    onClickMenu () {
        const p = UiHelper.instance.showUi('prefabs/game/ui_ingame_menus');
        p.then(ui => (ui.ondestroy = ()=> this.node.active = true));
        this.node.active = false;
    },

    onClickTalentIcon () {
        this.isTalentSelected = !this.isTalentSelected;
        this.btnInfo.active = this.isTalentSelected;
        const widget = this.talentsPanel.getComponent(cc.Widget);
        const scroll = this.talentsPanel.getComponent(cc.ScrollView);
        widget.bottom = this.isTalentSelected ? 137+52 : 137;
        // widget.updateAlignment();
        // scroll.scrollToBottom();
    },

});
