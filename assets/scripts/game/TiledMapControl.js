
const BACKGROUND_NAME = 'Background';
const FOREGROUND_NAME = 'Foreground';

cc.Class({
    extends: cc.Component,

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
        this.layerBackground = this.tiledMap.getLayer(BACKGROUND_NAME);
        this.layerForeground = this.tiledMap.getLayer(FOREGROUND_NAME);
    },

    getPositionAt (grid) {
        const pos = this.layerBackground.getPositionAt(grid);
        pos.x += this.tileSize.width/2.0;
        pos.y += this.tileSize.height/2.0;
        return pos;
    },

    _prehandler () {
        this.tiledMap.getObjectGroup('Rooms').node.destroy();
        this.tiledMap.getObjectGroup('Blocks').node.destroy();
    },
});
