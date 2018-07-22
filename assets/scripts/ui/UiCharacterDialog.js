
const LoaderHelper = require('CCLoaderHelper');

cc.Class({
    extends: cc.Component,

    properties: {
        portrait: cc.Sprite,
        text: cc.Label,
        fonts: [cc.Font],
    },

    onLoad () {
        this.portrait.spriteFrame = null;
        this.text.string = '';
        this.text.font = this.fonts[0];
    },

    init (talkList) {
        this.talkList = talkList || [];
        this._showNextTalk();
    },

    start () {
        const talkList = [
            {
                portrait: '89d9db05-84ae-439b-a471-161852fa0c6d',
                font: 0,
                text: 'Hello Wolrd',
            },
            {
                portrait: '89d9db05-84ae-439b-a471-161852fa0c6d',
                font: 1,
                text: 'Hello Wolrd 2222222222',
            },
            {
                portrait: '89d9db05-84ae-439b-a471-161852fa0c6d',
                font: 0,
                text: 'Hello Wolrd 33333333333',
            },
        ];
        this.init(talkList);
    },

    onClickAnywhere () {
        this._showNextTalk();
    },

    onClickSkip () {
        this.node.destroy();
    },

    _showNextTalk () {
        if (this.talkList.length === 0) {
            this.node.destroy();
            return;
        }

        const talk = this.talkList.shift();
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
