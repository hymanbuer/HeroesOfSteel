
const NUM_FOG_TILES = 16;
const FOG_TILE_WIDTH = 128;
const FOG_TILE_HEIGHT = 128;
const FOG_TILESET_ROWS = 4;
const FOG_TILESET_COLS = 4;

cc.Class({
    extends: cc.Component,

    properties: {
        fogTileset: cc.Texture2D,
    },

    _initFogTileRects () {
        this.fogTileRects = new Array(NUM_FOG_TILES);
        for (let i = 0; i < NUM_FOG_TILES; ++i) {
            const x = Math.floor(i / FOG_TILESET_COLS) * FOG_TILE_WIDTH;
            const y = (i % FOG_TILESET_COLS) * FOG_TILE_HEIGHT;
            const rect = cc.rect(x, y, FOG_TILE_WIDTH, FOG_TILE_HEIGHT);
            this.fogTileRects[i] = rect;
        }
    },

    _initFogs () {
        this.fogWidth = 960 / FOG_TILE_WIDTH;
        this.fogHeight = 640 / FOG_TILE_HEIGHT;
        this.fogIndexes = [];
        for (let y = 0; y < this.fogHeight; ++y) {
            this.fogIndexes.push(new Array(this.fogWidth).fill(0))
        }
        this._updateFogs();
    },

    _updateFogs () {
        this.node.removeAllChildren();
        this.fogIndexes.forEach((indexes, y) => indexes.forEach((index, x) => {
            if (x === 0 && y === 0) return;
            const sprite = this._createFogSprite(index);
            sprite.node.anchorPoint = cc.v2(0, 0);
            sprite.node.x = x * FOG_TILE_WIDTH;
            sprite.node.y = y * FOG_TILE_HEIGHT;
            this.node.addChild(sprite.node);
        }));
    },

    onLoad () {
        this._initFogTileRects();
        // this._initFogs();
        this.test_fog_tile_rects();
    },

    start () {

    },

    _createFogSprite (index) {
        const rect = this.fogTileRects[index % this.fogTileRects.length];
        const node = new cc.Node();
        const sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = new cc.SpriteFrame(this.fogTileset, rect);
        return sprite;
    },

    test_fog_tile_rects () {
        this.node.removeAllChildren();
        const offset = cc.v2(0, 0);
        for (let col = 0; col < FOG_TILESET_COLS; col++) {
            for (let row = 0; row < FOG_TILESET_ROWS; row++) {
                const x = col * FOG_TILE_WIDTH + offset.x;
                const y = (FOG_TILESET_ROWS-row-1) * FOG_TILE_HEIGHT + offset.y;
                const index = col * FOG_TILESET_COLS + row;
                const sprite = this._createFogSprite(index);
                sprite.node.anchorPoint = cc.v2(0, 0);
                sprite.node.x = x;
                sprite.node.y = y;
                this.node.addChild(sprite.node);
                cc.log(index, x, y);
            }
        }
    },

    test_show_fog_tile () {
        if (typeof this.tileIndex !== 'number') this.tileIndex = -1;
        this.tileIndex = (this.tileIndex + 1) % NUM_FOG_TILES;
        const sprite = this._createFogSprite(this.tileIndex);
        sprite.node.anchorPoint = cc.v2(0, 0);
        this.node.removeAllChildren();
        this.node.addChild(sprite.node);
        cc.log('show fog tile', this.tileIndex);
    },
});
