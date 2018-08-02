
const ItemStore = require('ItemStore');

const itemInfos = [];

// All Episodes
itemInfos.push({})
itemInfos[0].icon = 'store/episode_all_option_5';
itemInfos[0].title = 'All Episodes';
itemInfos[0].content = 'Unlock all 4 story Episodes,\
 fight mighty battles across 100+ Dungeons and 10+ Towns.';
itemInfos[0].price = 3.96;

// Episode 1: Death's Consort
itemInfos.push({})
itemInfos[1].icon = ['sheets/ui_initial2', 'dialog_option_1'];
itemInfos[1].title = 'Episode 1: Death\'s Consort';
itemInfos[1].content = 'Any group can play Episode 1.\
 Clash against threats across 25 Dungeons, 2 Towns.';
itemInfos[1].price = 0.99;

// Episode 2: The Gathering Shadow
itemInfos.push({})
itemInfos[2].icon = ['sheets/ui_initial2', 'dialog_option_2'];
itemInfos[2].title = 'Episode 2: The Gathering Shadow';
itemInfos[2].content = 'Any group can play Episode 2.\
 Battle against new enemies across 32 Dungeons, 7 Towns.';
itemInfos[2].price = 0.99;

// Episode 3: Whispers over Steel
itemInfos.push({})
itemInfos[3].icon = ['sheets/ui_initial2', 'dialog_option_3'];
itemInfos[3].title = 'Episode 3: Whispers over Steel';
itemInfos[3].content = 'Any group can play Episode 3,\
 fight to protect a crumbling world across 32 Dungeons, 8 Towns.';
itemInfos[3].price = 0.99;

// Episode 4: Rise of the Chosen
itemInfos.push({})
itemInfos[4].icon = ['sheets/ui_initial2', 'dialog_option_4'];
itemInfos[4].title = 'Episode 4: Rise of the Chosen';
itemInfos[4].content = 'Any group can play Episode 4,\
 battle toward the epic conclusion across 16 Dungeons, 3 Towns.';
itemInfos[4].price = 0.99;

// Character: Kincaid the Dueler
itemInfos.push({})
itemInfos[5].icon = ['sheets/ui_initial', 'char_hud_dueler'];
itemInfos[5].title = 'Character: Kincaid the Dueler';
itemInfos[5].content = 'Add to a new group in Warrior slot:\
 bladesman living by his speed and finesse.';
itemInfos[5].price = 1.99;

// Character: Selen the Rogue
itemInfos.push({})
itemInfos[6].icon = ['sheets/ui_initial', 'char_hud_rogue'];
itemInfos[6].title = 'Character: Selen the Rogue';
itemInfos[6].content = 'Add to a new group in Sneak slot:\
 silent in stealth, but a whirlwind in melee.';
itemInfos[6].price = 1.99;

// Character: Vincent the Sorcerer
itemInfos.push({})
itemInfos[7].icon = ['sheets/ui_initial', 'char_hud_sorcerer'];
itemInfos[7].title = 'Character: Vincent the Sorcerer';
itemInfos[7].content = 'Add to a new group in Mage slot:\
 master of area of effect magic and spellsword.';
itemInfos[7].price = 1.99;

// Character: Fyona the Paladin
itemInfos.push({})
itemInfos[8].icon = ['sheets/ui_initial', 'char_hud_paladin'];
itemInfos[8].title = 'Character: Fyona the Paladin';
itemInfos[8].content = 'Add to a new group in Healer slot:\
 heavily armored divine warrior, defender and healer.';
itemInfos[8].price = 1.99;

// Unlock: Boost-In and Re-Spec
itemInfos.push({})
itemInfos[9].icon = ['sheets/ui_initial2', 'iap_unlock'];
itemInfos[9].title = 'Unlock: Boost-In and Re-Spec';
itemInfos[9].content = 'Boost-In any new group to Episode 2.\
 All groups gain 1 free Re-Spec per character.\
 Re-allocate your Attributes, Skills, Talents.';
itemInfos[9].price = 0.99;

cc.Class({
    extends: cc.Component,

    properties: {
        detailPrefabs: [cc.Prefab],
        storeItemPrefab: cc.Prefab,
        storeItems: cc.Node,
        detail: cc.Node,
        title: cc.Label,
    },

    start () {
        this.node.on('clickitem', this.onClickItem, this);

        for (let i = 0; i < itemInfos.length; ++i) {
            const info = itemInfos[i];
            const item = cc.instantiate(this.storeItemPrefab);
            item.getComponent(ItemStore).init(info, i);
            this.storeItems.addChild(item);
        }

        this._hideItemDetails();
    },

    onClickBack () {
        if (this.detail.active) {
            this._hideItemDetails();
            this.title.string = 'Game Store';
        } else {
            this.node.destroy();
        }
    },

    onClickItem (event) {
        event.stopPropagationImmediate();
        this._showItemDetails(event.detail);
    },

    _hideItemDetails () {
        this.detail.active = false;
        this.storeItems.active = true;
        this.detail.removeAllChildren();
    },

    _showItemDetails (index) {
        this.detail.active = true;
        this.storeItems.active = false;
        this.title.string = itemInfos[index].title;

        const node = cc.instantiate(this.detailPrefabs[index]);
        this.detail.addChild(node);
    },
});
