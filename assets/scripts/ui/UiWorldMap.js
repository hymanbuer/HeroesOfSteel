
// TODO Add this method if necessary
// This method is removed because it's not existed in native.
function getTileFlagsAt(layer, pos, y) {
    if (layer && layer._sgNode) {
        return layer._sgNode.getTileFlagsAt(pos, y);
    }
    return 0;
}

cc.Class({
    extends: cc.Component,

    properties: {
        tiledMap: cc.TiledMap,
        flag: cc.Sprite,
        sword: cc.Node,
        camera: cc.Camera,

        flagActive: cc.SpriteFrame,
        falgInactive: cc.SpriteFrame,
    },

    onLoad () {
        this.tiledMap.getObjectGroup('StateAlpha').node.destroy();
        this.tiledMap.getObjectGroup('StateBeta').node.destroy();
        this.tiledMap.getLayer('TileStateAlpha').node.destroy();
        this.tiledMap.getLayer('TileStateBeta').node.destroy();

        const tileSize = this.tiledMap.getTileSize();
        const layer = this.tiledMap.getLayer('Background');
        const focusGrid = cc.v2(25, 11);
        const pos = layer.getPositionAt(focusGrid);
        pos.x += tileSize.width/2.0;
        pos.y += tileSize.height/2.0;
        this.sword.x = this.camera.node.x = pos.x;
        this.sword.y = this.camera.node.y = pos.y;

        this.oldCamera = cc.Camera.main;
        if (this.oldCamera)
            this.oldCamera.enabled = false;
        this.camera.enabled = true;

        // check tile flags
        const mapSize = this.tiledMap.getMapSize();
        const TileFlag = cc.TiledMap.TileFlag;
        for (let y = 0; y < mapSize.height; ++y) {
            for (let x = 0; x < mapSize.width; ++x) {
                const tile = layer.getTileAt(x, y);
                if (!tile) continue;

                const flags = getTileFlagsAt(layer, x, y);
                if (flags === 0) continue;

                const pos = layer.getPositionAt(x, y);
                tile.anchorX = tile.anchorY = 0.5;
                tile.x = pos.x + tileSize.width/2.0;
                tile.y = pos.y + tileSize.height/2.0;
                
                if (flags & TileFlag.DIAGONAL) {
                    const HV = (TileFlag.HORIZONTAL | TileFlag.VERTICAL) >>> 0;
                    const flag = (flags & HV) >>> 0;
                    if (flag === TileFlag.HORIZONTAL)
                        tile.rotation = 90;
                    else if (flag === TileFlag.VERTICAL)
                        tile.rotation = 270;
                    else if (flag === HV) {
                        tile.rotation = 90;
                        tile.scaleX = -1;
                    } else {
                        tile.rotation = 270;
                        tile.scaleX = -1;
                    }
                } else {
                    if (flags & TileFlag.HORIZONTAL)
                        tile.scaleX = -1;
                    if (flags & TileFlag.VERTICAL)
                        tile.scaleY = -1;
                }
            }
        }
    },

    onClickBack () {
        this.camera.enabled = false;
        if (this.oldCamera)
            this.oldCamera.enabled = true;
        this.node.destroy();
    },
});
