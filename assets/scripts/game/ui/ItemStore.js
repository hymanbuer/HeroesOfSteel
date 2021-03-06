
cc.Class({
    extends: cc.Component,

    properties: {
        icon: cc.Sprite,
        title: cc.Label,
        content: cc.Label,
        price: cc.Label,
        index: 0,
    },

    init (info, index) {
        const {icon, title, content, price} = info;
        this.title.string = title;
        this.content.string = content;
        this.price.string = `$${price}`;
        this.index = index;

        this.icon.spriteFrame = null;
        if (typeof icon === 'string') {
            cc.loader.loadRes(icon, cc.SpriteFrame, (err, spriteFrame) => {
                this.icon.spriteFrame = spriteFrame;
            });
        } else {
            const [atlasPath, spriteFrameName] = icon;
            cc.loader.loadRes(atlasPath, cc.SpriteAtlas, (err, atlas) => {
                if (!err) {
                    const spriteFrame = atlas.getSpriteFrame(spriteFrameName);
                    this.icon.spriteFrame = spriteFrame;
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
