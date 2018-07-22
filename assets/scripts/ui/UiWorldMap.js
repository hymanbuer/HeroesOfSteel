
// TODO Add this method if necessary
// This method is removed because it's not existed in native.
function getTileFlagsAt(layer, pos, y) {
    if (layer && layer._sgNode && pos) {
        return layer._sgNode.getTileFlagsAt(pos, y);
    }
    return 0;
}

function checkTileFlags(layer) {
    const TileFlag = cc.TiledMap.TileFlag;
    const layerSize = layer.getLayerSize();
    const tileSize = layer.getMapTileSize();
    for (let y = 0; y < layerSize.height; ++y) {
        for (let x = 0; x < layerSize.width; ++x) {
            const tile = layer.getTileAt(x, y);
            if (!tile) continue;

            // why x would be null in sometimes?
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
}

const locations = [
    cc.v2(25, 11),
    cc.v2(24, 12),
    cc.v2(19, 13),
    cc.v2(15, 14),
];

cc.Class({
    extends: cc.Component,

    properties: {
        tiledMap: cc.TiledMap,
        flag: cc.Sprite,
        sword: cc.Node,
        camera: cc.Camera,
        view: cc.Node,

        flagActive: cc.SpriteFrame,
        falgInactive: cc.SpriteFrame,
    },

    start () {
        this.tiledMap.getObjectGroup('StateAlpha').node.destroy();
        this.tiledMap.getObjectGroup('StateBeta').node.destroy();
        this.tiledMap.getLayer('TileStateAlpha').node.destroy();
        this.tiledMap.getLayer('TileStateBeta').node.destroy();

        checkTileFlags(this.tiledMap.getLayer('Background'));
        checkTileFlags(this.tiledMap.getLayer('Environment'));

        // TODO: get the index of location
        const index = 0;
        this._activeThisCamera();
        this._focusOn(locations[index]);
    },

    onClickBack () {
        this._restoreOldCamera();
        this.node.destroy();
    },

    _focusOn (grid) {
        const tileSize = this.tiledMap.getTileSize();
        const background = this.tiledMap.getLayer('Background');
        const pos = background.getPositionAt(grid);
        pos.x += tileSize.width/2.0;
        pos.y += tileSize.height/2.0;
        this.sword.x = pos.x;
        this.sword.y = pos.y;
        this.camera.node.x = pos.x - this.view.width/2.0;
        this.camera.node.y = pos.y - this.view.height/2.0;
    },

    _activeThisCamera () {
        this.oldCamera = cc.Camera.main;
        if (this.oldCamera)
            this.oldCamera.enabled = false;
        this.camera.enabled = true;
    },

    _restoreOldCamera () {
        this.camera.enabled = false;
        if (this.oldCamera)
            this.oldCamera.enabled = true;
    },
});
