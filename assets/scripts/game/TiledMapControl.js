

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
        this._initLayers();
        this.mapSize = this.tiledMap.getMapSize();
        this.tileSize = this.tiledMap.getTileSize();
    },

    getMapSize () {
        return this.mapSize;
    },

    getTileSize () {
        return this.tileSize;
    },

    getPositionAt (grid) {
        const pos = this.layerBackground.getPositionAt(grid);
        pos.x += this.tileSize.width/2.0;
        pos.y += this.tileSize.height/2.0;
        return pos;
    },

    getGridAt (pos) {
        const x = Math.floor((pos.x+0.5) / this.tileSize.width);
        const y = (this.mapSize.height-1) - Math.floor((pos.y+0.5)/this.tileSize.height);
        return cc.v2(x, y);
    },

    setTileIdAt (grid, id, layerName) {
        const layer = this.tiledMap.getLayer(layerName);
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
        const tp = this.tiledMap.getPropertiesForGID(gid);
        return tp || {};
    },

    _getTileGidAt (grid, layerName) {
        const layer = this.tiledMap.getLayer(layerName);
        const gid = layer.getTileGIDAt(grid.x, grid.y);
        return gid;
    },

    _initLayers () {
        this.tiledMap.getObjectGroup('Rooms').node.destroy();
        this.tiledMap.getObjectGroup('Blocks').node.destroy();

        // origin tile layers
        this.layerBackground = this.tiledMap.getLayer('Background');
        this.layerEffects = this.tiledMap.getLayer('Effects');
        this.layerForeground = this.tiledMap.getLayer('Foreground');
        this.layerBlocks = this.tiledMap.getLayer('Blocks');
        this.layerFog = this.tiledMap.getLayer('Fog');
        this.layerCollision = this.tiledMap.getLayer('Collision');
        this.layerRooms = this.tiledMap.getLayer('Rooms');

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
