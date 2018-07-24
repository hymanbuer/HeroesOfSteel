
const LayerName = cc.Enum({
    Background: 'Background',
    Foreground: 'Foreground',
});

cc.Class({
    extends: cc.Component,

    statics: {
        LayerName: LayerName,
    },

    properties: {
        tiledMap: cc.TiledMap,
    },

    onLoad () {
        const tmxAsset = cc.loader.getRes('maps/map_2_region_10');
        this.tiledMap = this.addComponent(cc.TiledMap);
        this.tiledMap.tmxAsset = tmxAsset;
    },

    start () {
        this._prehandler();

        this.mapSize = this.tiledMap.getMapSize();
        this.tileSize = this.tiledMap.getTileSize();
        this.layerBackground = this.tiledMap.getLayer(LayerName.Background);
        this.layerForeground = this.tiledMap.getLayer(LayerName.Foreground);
    },

    getPositionAt (grid) {
        const pos = this.layerBackground.getPositionAt(grid);
        pos.x += this.tileSize.width/2.0;
        pos.y += this.tileSize.height/2.0;
        return pos;
    },

    setTileIdAt (grid, id, layerName = LayerName.Background) {
        const layer = this.tiledMap.getLayer(layerName);
        const gid = id + layer.getTileSet().firstGid;
        layer.setTileGID(gid, grid);
    },

    addEntity (node) {
        this.tiledMap.node.addChild(node);
    },

    _prehandler () {
        this.tiledMap.getObjectGroup('Rooms').node.destroy();
        this.tiledMap.getObjectGroup('Blocks').node.destroy();
    },
});
