
cc.Class({
    extends: cc.Component,

    properties: {
        profileName: cc.Label,
        tips: cc.Node,
        keys: cc.Node,
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
        const label = this._getKeyLabel(event.target);
        this._addChar(label.string);
    },

    onShift () {
        this.isLowerCase = !this.isLowerCase;
        this.alterKeys.forEach(key => {
            if (this.isLowerCase)
                key.string = key.string.toLowerCase();
            else
                key.string = key.string.toUpperCase();
        });
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

    onSave () {
        const event = new cc.Event.EventCustom('savename', true);
        event.detail = this.profileName.string;
        this.node.dispatchEvent(event)
        this.node.destroy();
    },

    onCancel () {
        this.node.destroy();
    },

    // ----------------------------

    _initKeys () {
        this.alterKeys = [];
        this.isLowerCase = true;
        this.keys.children.forEach(line => line.children.forEach(key => {
            if (/shift/i.test(key.name)) {
                key.on('click', this.onShift, this);
                this._pushAlterKey(key);
            } else if (/del/i.test(key.name)) {
                key.on('click', this.onDelete, this);
                key.on('touchstart', this._onPressDel, this);
                key.on('touchend', this._onReleaseDel, this);
            } else if (/space/i.test(key.name)) {
                key.on('click', this.onSpace, this);
            } else {
                key.on('click', this.onEdit, this);
                if (/[a-zA-Z]/i.test(key.name))
                    this._pushAlterKey(key);
            }
        }));
    },

    _pushAlterKey (key) {
        this.alterKeys.push(this._getKeyLabel(key));
    },

    _getKeyLabel (key) {
        return key.children[0].getComponent(cc.Label);
    },

    _addChar (char) {
        this.profileName.string = this.profileName.string + char;
        this._updateView();
    },

    _updateView () {
        const isEmpty = this.profileName.string.length === 0;
        this.profileName.node.active = !isEmpty;
        this.tips.active = isEmpty;
    },

    _onPressDel () {
        this.schedule(this.onDelete, 0.05);
    },

    _onReleaseDel () {
        this.unschedule(this.onDelete);
    },
});
