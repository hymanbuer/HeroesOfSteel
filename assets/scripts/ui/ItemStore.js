
cc.Class({
    extends: cc.Component,

    properties: {
        icon: cc.Sprite,
        title: cc.Label,
        content: cc.Label,
        price: cc.Label,
    },

    init (info, index) {
        const {icon, title, content, price} = info;
        this.title.string = title;
        this.content.string = content;
        this.price.string = `$${price}`;
        this.index = index;

        const self = this;
        self.icon.spriteFrame = null;
        if (typeof icon === 'string') {
            cc.loader.loadRes(icon, cc.SpriteFrame, function (err, spriteFrame) {
                self.icon.spriteFrame = spriteFrame;
            });
        } else {
            const [atlasPath, spriteFrameName] = icon;
            cc.loader.loadRes(atlasPath, cc.SpriteAtlas, function (err, atlas) {
                if (!err) {
                    const spriteFrame = atlas.getSpriteFrame(spriteFrameName);
                    self.icon.spriteFrame = spriteFrame;
                }
            });
        }
    },

    onClick () {
        cc.log(`click item <${this.title.string}>`);
        const event = new cc.Event.EventCustom('clickitem', true);
        event.detail = this.index;
        this.node.dispatchEvent(event)
    },
});
