
const UiHelper = require('UiHelper');

const menuMap = new Map();
menuMap.set('play', 'prefabs/main/ui_name_editor');
menuMap.set('store', 'prefabs/main/ui_store');
menuMap.set('options', 'prefabs/main/ui_options');
menuMap.set('credits', 'prefabs/main/ui_credits');
menuMap.set('more_games', 'prefabs/main/ui_more_games');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        
    },

    start () {

    },

    onClickMenu (event) {
        const menuName = event.target.name;
        const prefabPath = menuMap.get(menuName);
        if (prefabPath)
            UiHelper.instance.showUi(prefabPath);
    }
});
