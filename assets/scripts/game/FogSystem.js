
const TiledMapControl = require('TiledMapControl');

const MAX_FOG_INDEX = 15;
const FOG_IDS = [
    0, 4, 8, 12,
    1, 5, 9, 13,
    2, 6, 10, 14,
    3, 7, 11, 15,
];
const BLOCK_IDS = FOG_IDS.map(id => id + 16);

const FogFlag = cc.Enum({
    TOP_LEFT: 0x80000000,
    TOP_RIGHT: 0x40000000,
    BOTTOM_LEFT: 0x20000000,
    BOTTOM_RIGHT: 0x10000000,
    FOG_ALL: (0x80000000|0x40000000|0x20000000|0x10000000) >>> 0,
    FOG_MASK: (~((0x80000000|0x40000000|0x20000000|0x10000000) >>> 0)) >>> 0
});

const GRID_POINTS = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
];

const POINT_GRIDS = [
    [0, 0, 2, FogFlag.TOP_LEFT],
    [-1, -1, 4, FogFlag.BOTTOM_RIGHT],
    [0, -1, 8, FogFlag.BOTTOM_LEFT],
    [-1, 0, 1, FogFlag.TOP_RIGHT],
];

const EIGHT_DIRECTIONS = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
];

cc.Class({
    extends: cc.Component,

    properties: {
        tiledMapCtrl: TiledMapControl,
    },

    onLoad () {

    },

    start () {
        this._mapSize = this.tiledMapCtrl.getMapSize();
        this._fogStates = [];
        this._blockStates = [];
        for (let y = 0; y <= this._mapSize.height; ++y) {
            this._fogStates[y] = new Array(this._mapSize.width).fill(0);
            this._blockStates[y] = new Array(this._mapSize.width).fill(0);
        }

        for (let y = 0; y < this._mapSize.height; ++y) {
            for (let x = 0; x < this._mapSize.width; ++x) {
                const fogId = FOG_IDS[this._getFogIndex(x, y)];
                const blockId = BLOCK_IDS[ this._blockStates[y][x] ];
                this.tiledMapCtrl.setTileIdAt({x, y}, fogId, 'Fog');
                // this.tiledMapCtrl.setTileIdAt({x, y}, blockId, 'Blocks');
            }
        }

        this._searchRevealGrids = this._createSearchMethod();
    },

    reveal (startGrid, brightDistance, greyDistance) {
        const grids = this._searchRevealGrids(startGrid, brightDistance);
        grids.forEach(grid => this._revealGrid(grid));
    },

    conceal (startGrid, distance) {

    },

    _createSearchMethod () {
        const getNeighbors = next => {
            const grids = [];
            for (const offset of EIGHT_DIRECTIONS) {
                const x = next.x + offset[0];
                const y = next.y + offset[1];
                if (this._isValidGridXY(x, y))
                    grids.push({x, y});
            }
            return grids;
        };

        const visited = [];
        for (let y = 0; y <= this._mapSize.height; ++y)
            visited[y] = new Array(this._mapSize.width).fill(false);

        return (startGrid, distance) => {
            const grids = [];
            const queue = [];
            const dirty = [];
            queue.push(startGrid);
            startGrid.distance = 0;
            while (queue.length > 0) {
                const next = queue.shift();
                grids.push(next);
                dirty.push(next);
                if (next.distance >= distance) continue;

                for (const neighbor of getNeighbors(next)) {
                    if (!visited[neighbor.y][neighbor.x]) {
                        visited[neighbor.y][neighbor.x] = true;
                        neighbor.distance = next.distance + 1;
                        queue.push(neighbor);
                    }
                }
            }

            dirty.forEach(grid => visited[grid.y][grid.x] = false);

            return grids;
        };
    },

    _revealGrid (grid) {
        for (const offset of GRID_POINTS) {
            const point = cc.v2(grid.x + offset[0], grid.y + offset[1]);
            if (!this._isValidPointXY(point.x, point.y)) continue;
            if (this._isRevealedPoint(point)) continue;

            this._revealPoint(point);
        }
    },

    _revealPoint (point) {
        for (const offset of POINT_GRIDS) {
            const x = point.x + offset[0];
            const y = point.y + offset[1];
            if (this._isValidGridXY(x, y)) {
                let fogInex = this._getFogIndex(x, y) + offset[2];
                fogInex =  Math.min(fogInex, MAX_FOG_INDEX);

                let flags = (this._fogStates[y][x] & FogFlag.FOG_ALL | offset[3]) >>> 0;
                this._fogStates[y][x] = (flags | fogInex) >>> 0;

                const fogId = FOG_IDS[fogInex];
                this.tiledMapCtrl.setTileIdAt({x, y}, fogId, 'Fog');
            }
        }
    },

    _isRevealedPoint (point) {
        for (const offset of POINT_GRIDS) {
            const x = point.x + offset[0];
            const y = point.y + offset[1];
            if (this._isValidGridXY(x, y) && (this._fogStates[y][x] & offset[3]))
                return true;
        }
        return false;
    },

    _isValidPointXY (x, y) {
        return x >= 0 && x <= this._mapSize.width
            && y >= 0 && y <= this._mapSize.height;
    },

    _isValidGridXY (x, y) {
        return x >= 0 && x < this._mapSize.width
            && y >= 0 && y < this._mapSize.height;
    },

    _getFogIndex (x, y) {
        return (this._fogStates[y][x] & FogFlag.FOG_MASK) >>> 0;
    },
});
