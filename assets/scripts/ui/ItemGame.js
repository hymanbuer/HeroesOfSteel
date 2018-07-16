
cc.Class({
    extends: cc.Component,

    properties: {
        icon: cc.Sprite,
        title: cc.Label,
        content: cc.Label,
        url: '',
    },

    init (info) {
        const {icon, title, content, url} = info;
        this.title.string = title;
        this.content.string = content;
        this.url = url;

        this.icon.spriteFrame = null;
        cc.loader.loadRes(icon, cc.SpriteFrame, (err, spriteFrame) => {
            this.icon.spriteFrame = spriteFrame;
        });
    },

    onClick () {
        cc.log(`click item <${this.title.string}>`);
        cc.sys.openURL(this.url);
    },
});
