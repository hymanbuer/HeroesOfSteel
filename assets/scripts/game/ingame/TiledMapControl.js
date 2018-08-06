
const LoaderHelper = require('CCLoaderHelper');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    init (tiledMapUrl) {
        return LoaderHelper.loadResByUrl(tiledMapUrl, cc.TiledMapAsset)
            .then((tmxAsset)=> {
                this._tiledMap = this.addComponent(cc.TiledMap);
                this._tiledMap.tmxAsset = tmxAsset;
                this._mapSize = this._tiledMap.getMapSize();
                this._tileSize = this._tiledMap.getTileSize();
                this._initLayers();
            });
    },

    getMapSize () {
        return this._mapSize;
    },

    getTileSize () {
        return this._tileSize;
    },

    getPositionAt (grid) {
        const pos = this.layerBackground.getPositionAt(grid);
        pos.x += this._tileSize.width/2.0;
        pos.y += this._tileSize.height/2.0;
        return pos;
    },

    getGridAt (pos) {
        const x = Math.floor((pos.x+0.5) / this._tileSize.width);
        const y = (this._mapSize.height-1) - Math.floor((pos.y+0.5)/this._tileSize.height);
        return cc.v2(x, y);
    },

    setTileIdAt (grid, id, layerName) {
        const layer = this._tiledMap.getLayer(layerName);
        const gid = id + layer.getTileSet().firstGid;
        layer.setTileGID(gid, grid);
    },

    addCharacter (node) {
        this.layerCharacters.addChild(node);
    },

    removeCharacterByTag (tag) {
        this.layerCharacters.removeChildByTag(tag);
    },

    getCharacterByTag (tag) {
        return this.layerCharacters.getChildByTag(tag);
    },

    isBlockViewAt (grid) {
        return !this._testTilePropertiesAt(grid, 'Background', /[ms]/i)
            && this._getTileGidAt(grid, 'Foreground') === 0;
    },

    isLightSourceAt (grid) {
        return this._testTilePropertiesAt(grid, 'Foreground', /ls/i)
    },

    getLightConfigAt (grid) {
        if (this.isLightSourceAt(grid))
            return {bright: 2, grey: 1};
        return null;
    },

    _testTilePropertiesAt (grid, layerName, regExp) {
        for (const key in this._getTilePropertiesAt(grid, layerName)) {
            if (regExp.test(key)) return true;
        }
        return false;
    },

    _getTilePropertiesAt (grid, layerName) {
        const gid = this._getTileGidAt(grid, layerName);
        const tp = this._tiledMap.getPropertiesForGID(gid);
        return tp || {};
    },

    _getTileGidAt (grid, layerName) {
        const layer = this._tiledMap.getLayer(layerName);
        const gid = layer.getTileGIDAt(grid.x, grid.y);
        return gid;
    },

    _initLayers () {
        this._tiledMap.getObjectGroup('Rooms').node.destroy();
        this._tiledMap.getObjectGroup('Blocks').node.destroy();

        // origin tile layers
        this.layerBackground = this._tiledMap.getLayer('Background');
        this.layerEffects = this._tiledMap.getLayer('Effects');
        this.layerForeground = this._tiledMap.getLayer('Foreground');
        this.layerBlocks = this._tiledMap.getLayer('Blocks');
        this.layerFog = this._tiledMap.getLayer('Fog');
        this.layerCollision = this._tiledMap.getLayer('Collision');
        this.layerRooms = this._tiledMap.getLayer('Rooms');

        // constom layers
        this.layerSystemEffects = new cc.Node('SystemEffects');
        this.layerCharacters = new cc.Node('Characters');
        this.layerTalentEffects = new cc.Node('TalentEffects');
        this.node.addChild(this.layerSystemEffects);
        this.node.addChild(this.layerCharacters);
        this.node.addChild(this.layerTalentEffects);

        this.layerBackground.node.setLocalZOrder(0);
        this.layerEffects.node.setLocalZOrder(1);
        this.layerForeground.node.setLocalZOrder(2);
        this.layerBlocks.node.setLocalZOrder(3);
        this.layerFog.node.setLocalZOrder(4);
        this.layerCollision.node.setLocalZOrder(5);
        this.layerRooms.node.setLocalZOrder(6);
        this.layerSystemEffects.setLocalZOrder(4);
        this.layerCharacters.setLocalZOrder(5);
        this.layerTalentEffects.setLocalZOrder(6);
    },
});
