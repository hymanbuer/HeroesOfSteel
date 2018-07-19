
const UiNameEditor = require('UiNameEditor');
const ItemStore = require('ItemStore');

const characterTiles = [
    'Vraes the Outlander',
    'Kjartan the Wizard',
    'Kyera the Cleric',
    'Tamilin the Thief',
    'Kincaid the Dueler',
    'Vincent the Sorcerer',
    'Fyona the Paladin',
    'Selen the Rogue',
];
const numCharacters = 8;
const numSlots = 4;

const difficultyNames = [
    'Easy',
    'Normal',
    'Hard',
    'Brutal',
    'Nightmare',
];

cc.Class({
    extends: cc.Component,

    properties: {
        main: cc.Node,
        detail: cc.Node,
        title: cc.Label,
        menus: cc.Node,
        portraits: [cc.Sprite],
        profileName: cc.Label,
        difficultyName: cc.Label,

        nameEditorPrefab: cc.Prefab,
        difficultiesPrefab: cc.Prefab,
        characterDetails: [cc.Prefab],
        characterPortraits: [cc.SpriteFrame],
    },

    start () {
        this._hideDetails();
        this._heroSlots = [1, 2, 3, 4];
        this._updateDifficulty(1);

        this.node.on('changename', this.onChangeName, this);
        this.node.on('clickitem', this.onClickItem, this);
    },

    onClickBack () {
        if (this.detail.active) {
            this._hideDetails();
            this.title.string = 'CHOOSE YOUR 4 HEROES';
        } else {
            this.node.destroy();
        }
    },

    onClickPlay () {
        cc.director.loadScene('opening');
    },

    onClickBoost () {
        cc.director.loadScene('opening');
    },

    onClickName () {
        const node = this._showDetails('ENTER YOUR NAME', this.nameEditorPrefab);
        node.getComponent(UiNameEditor).init(this.profileName.string);
    },

    onClickDifficulty () {
        this._showDetails('CHOOSE DIFFICULTY', this.difficultiesPrefab);
    },

    onClickPortrait (_, index) {
        const id = this._heroSlots[index];
        const title = characterTiles[id - 1];
        const prefab = this.characterDetails[id - 1];
        this._showDetails(title, prefab);
    },

    onClickSwitch (_, index) {
        this._heroSlots[index] += numSlots;
        if (this._heroSlots[index] > numCharacters)
            this._heroSlots[index] = this._heroSlots[index] % numCharacters;

        const id = this._heroSlots[index];
        this.portraits[index].spriteFrame = this.characterPortraits[id - 1];
    },

    onChangeName (event) {
        const name = event.detail || '';
        const defaultName = 'Default Name';
        this.profileName.string = name === '' ? defaultName : name;
    },

    onClickItem (event) {
        const index = event.detail;
        this._updateDifficulty(index);
        this._hideDetails();
    },

    _hideDetails () {
        this.detail.active = false;
        this.main.active = true;
        this.menus.active = true;
        this.detail.removeAllChildren();
    },

    _showDetails (title, prefab) {
        this.detail.active = true;
        this.main.active = false;
        this.menus.active = false;
        this.title.string = title;
        
        const node = cc.instantiate(prefab);
        this.detail.addChild(node);
        return node;
    },

    _updateDifficulty (index) {
        this.difficultyName.string = difficultyNames[index];
        this.difficulty = index;
    },
});
