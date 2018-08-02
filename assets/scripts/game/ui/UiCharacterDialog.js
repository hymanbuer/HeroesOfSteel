
const LoaderHelper = require('CCLoaderHelper');

cc.Class({
    extends: cc.Component,

    properties: {
        portrait: cc.Sprite,
        text: cc.Label,
        fonts: [cc.Font],
        talkList: [],
    },

    onLoad () {
        this.portrait.spriteFrame = null;
        this.text.string = '';
        this.text.font = this.fonts[0];
    },

    start () {
        this._current = 0;
        this._showNextTalk();
    },

    onClickAnywhere () {
        this._showNextTalk();
    },

    onClickSkip () {
        this.node.destroy();
    },

    _showNextTalk () {
        if (this._current >= this.talkList.length) {
            this.node.destroy();
            return;
        }

        const talk = this.talkList[this._current++];
        LoaderHelper.loadResByUuid(talk.portrait).then(portrait => {
            this._setText(talk.text, talk.font);
            this.portrait.spriteFrame = portrait;
        }, err => {
            this._setText(talk.text, talk.font);
            this.portrait.spriteFrame = null;
        });
    },

    _setText (text, font) {
        this.text.string = text;
        this.text.font = this.fonts[font || 0];
    },
});
