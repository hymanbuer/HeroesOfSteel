
cc.Class({
    extends: cc.Component,

    properties: {
        profileName: cc.Label,
        tips: cc.Node,
        keys: cc.Node,
        values: cc.Node,
    },

    init (name) {
        this.profileName.string = typeof name === 'string' ? name : '';
        this._updateView();
    },

    start () {
        this._updateView();
        this._initKeys();
    },

    onEdit (event) {
        const label = this.wordLabelMap.get(event.target);
        this._addChar(label.string);
    },

    onShift () {
        this.isLowerCase = !this.isLowerCase;
        for (const label of this.wordLabelMap.values())
            if (this.isLowerCase)
                label.string = label.string.toLowerCase();
            else
                label.string = label.string.toUpperCase();
    },

    onDelete () {
        const name = this.profileName;
        if (name.string.length > 0) {
            name.string = name.string.substring(0, name.string.length - 1);
            this._updateView();
        }
    },

    onSpace () {
        this._addChar(' ');
    },

    // ----------------------------

    _initKeys () {
        this.wordLabelMap = new Map();
        this.isLowerCase = true;
        this.keys.children.forEach(line => line.children.forEach(key => {
            if (/shift/i.test(key.name)) {
                key.on('click', this.onShift, this);
                this._mapWord(line, key);
            } else if (/del/i.test(key.name)) {
                key.on('click', this.onDelete, this);
                key.on('touchstart', this._onPressDel, this);
                key.on('touchend', this._onReleaseDel, this);
            } else if (/space/i.test(key.name)) {
                key.on('click', this.onSpace, this);
            } else {
                key.on('click', this.onEdit, this);
                this._mapWord(line, key);
            }
        }));
    },

    _mapWord (line, key) {
        const path = `${line.name}/${key.name}`;
        const value = cc.find(path, this.values);
        const label = value.children[0].getComponent(cc.Label);
        this.wordLabelMap.set(key, label);
    },

    _addChar (char) {
        this.profileName.string = this.profileName.string + char;
        this._updateView();
    },

    _updateView () {
        const isEmpty = this.profileName.string.length === 0;
        this.profileName.node.active = !isEmpty;
        this.tips.active = isEmpty;

        const event = new cc.Event.EventCustom('changename', true);
        event.detail = this.profileName.string;
        this.node.dispatchEvent(event)
    },

    _onPressDel () {
        this.schedule(this.onDelete, 0.05);
    },

    _onReleaseDel () {
        this.unschedule(this.onDelete);
    },
});
