
cc.Class({
    extends: cc.Component,

    properties: {
        templateCatalogTitle: cc.Prefab,
        templateCatalogSubtitle: cc.Prefab,
        templateContentTitle: cc.Prefab,
        templateContentText: cc.Prefab,
        symbolAtals: cc.SpriteAtlas,
        library: cc.JsonAsset,

        catalog: cc.Node,
        content: cc.Node,
    },

    start () {
        const json = this.library.json;
        const topics = json.topics;
        this.setContent(json.initialContent);
        for (let i = 0; i < topics.length; i++) {
            const topic = topics[i];
            if (typeof topic[0] !== 'string') {
                this.addCatalogTitle(topic[1], i);
            } else {
                this.addCatalogSubtitle(topic[0], i);
            }
        }
    },

    onClickBack () {
        this.node.destroy();
    },

    addCatalogTitle (title, index) {
        const node = cc.instantiate(this.templateCatalogTitle);
        const text = node.getChildByName('text');
        const label = text.getComponent(cc.Label);
        label.string = title;
        this.catalog.addChild(node);
        this.catalogSubtitleCount = 0;

        this._addClickTopicHandler(node, index);
    },

    addCatalogSubtitle (title, index) {
        const node = cc.instantiate(this.templateCatalogSubtitle);
        const text = node.getChildByName('text');
        const label = text.getComponent(cc.Label);
        label.string = title;
        this.catalog.addChild(node);

        this.catalogSubtitleCount += 1;
        if (this.catalogSubtitleCount > 13)
            this.catalogSubtitleCount = 1;

        const symbol = node.getChildByName('symbol');
        const sprite = symbol.getComponent(cc.Sprite);
        const symbolName = `dialog_option_${this.catalogSubtitleCount}`;
        sprite.spriteFrame = this.symbolAtals.getSpriteFrame(symbolName);

        this._addClickTopicHandler(node, index);
    },

    addContentTitle (title) {
        const node = cc.instantiate(this.templateContentTitle);
        const label = node.getComponent(cc.Label);
        label.string = title;
        this.content.addChild(node);
    },

    addContentText (text) {
        const node = cc.instantiate(this.templateContentText);
        const label = node.getComponent(cc.Label);
        label.string = text;
        this.content.addChild(node);
    },

    setContent (texts, start = 0) {
        this.content.removeAllChildren();
        this.addContentTitle(texts[start]);
        for (let i = start + 1; i < texts.length; i++) {
            this.addContentText(texts[i]);
        }
    },

    onClickTopic (event) {
        const index = event.target.index || 0;
        const topic = this.library.json.topics[index];
        const start = typeof topic[0] !== 'string' ? 1 : 0;
        this.setContent(topic, start);
    },

    _addClickTopicHandler (node, index) {
        node.addComponent(cc.Button);
        node.on('click', this.onClickTopic, this);
        node.index = index;
    }
});