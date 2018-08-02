
const UiHelper = require('UiHelper');

const menuMap = new Map();
menuMap.set('play', 'prefabs/main/ui_create_profile');
menuMap.set('store', 'prefabs/main/ui_store');
menuMap.set('options', 'prefabs/main/ui_options');
menuMap.set('credits', 'prefabs/main/ui_credits');
menuMap.set('more_games', 'prefabs/main/ui_more_games');

cc.Class({
    extends: cc.Component,

    properties: {
        fire: cc.ParticleSystem,
        container: cc.Node,
    },

    onLoad () {
        
    },

    start () {
        this.scheduleOnce(()=> this.fire.resetSystem(), 0);
    },

    onClickMenu (event) {
        const menuName = event.target.name;
        const prefabPath = menuMap.get(menuName);
        if (prefabPath) {
            const p = UiHelper.instance.showUi(prefabPath);
            p.then(ui => {
                if (menuName === 'options') return;
                this.container.active = false;
                ui.ondestroy = ()=> this.container.active = true;
            });
        }
    }
});
