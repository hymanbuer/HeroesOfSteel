
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

        const self = this;
        self.icon.spriteFrame = null;
        cc.loader.loadRes(icon, cc.SpriteFrame, function (err, spriteFrame) {
            self.icon.spriteFrame = spriteFrame;
        });
    },

    onClick () {
        cc.log(`click game item <${this.title.string}>`);
        cc.sys.openURL(this.url);
    },
});
