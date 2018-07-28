
const TiledMapControl = require('TiledMapControl');

const MAX_FOG_INDEX = 15;
const DARK_IDS = [
    0, 4, 8, 12,
    1, 5, 9, 13,
    2, 6, 10, 14,
    3, 7, 11, 15,
];
const GREY_IDS = DARK_IDS.map(id => id + 16);

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

const FOUR_DIRECTIONS = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
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
        this._darkStates = this._createFogStates('Fog', DARK_IDS);
        this._greyStates = this._createFogStates('Blocks', GREY_IDS);
        this._lightSources = [];

        for (let y = 0; y < this._mapSize.height; ++y) {
            for (let x = 0; x < this._mapSize.width; ++x) {
                this._darkStates.updateTile(x, y);
                this._greyStates.updateTile(x, y);
            }
        }

        this._searchRevealGrids = this._createSearchMethod();
    },

    reveal (startGrid, brightDistance = 5, greyDistance = 1) {
        const greyGrids = this._doReveal(startGrid, brightDistance, greyDistance);
        greyGrids.forEach(grid => {
            const light = this.tiledMapCtrl.getLightConfigAt(grid)
            if (light && this._greyStates.getRevealCountAt(grid) === 1) {
                this.addLightSource(grid, light.bright, light.grey);
            }
        });
    },

    conceal (startGrid, distance = 5) {
        const greyGrids = this._doConceal(startGrid, distance);
        greyGrids.forEach(grid => {
            for (let i = this._lightSources.length - 1; i >= 0; --i) {
                const s = this._lightSources[i];
                if (s.grid.x === grid.x && s.grid.y === grid.y) {
                    this._lightSources.splice(i, 1);
                    this._doConceal(grid, s.light.bright);
                }
            }
        });
    },

    addLightSource (grid, bright = 0, grey = 0) {
        if (!this.findLightSource(grid, bright, grey)) {
            const light = {bright, grey};
            this._lightSources.push({grid, light});
            this._doReveal(grid, bright, grey);
        }
    },

    removeLightSource (grid, bright = 0, grey = 0) {
        const predicate = (s) => {
            return grid.x === s.grid.x && grid.y === s.grid.y
                && bright === s.light.bright && grey === s.light.grey;
        };
        const index = this._lightSources.findIndex(predicate);
        if (index >= 0) {
            this._lightSources.splice(index, 1);
            this.conceal(grid, bright);
        }
    },

    removeAllLightSourceAt (grid) {
        const lightSources = this._lightSources;
        this._lightSources = [];
        for (const s of lightSources) {
            if (s.grid.x === grid.x && s.grid.y === grid.y)
                this.conceal(grid, s.light.bright);
        }
    },

    findLightSource (grid, bright, grey) {
        const predicate = (s) => {
            return grid.x === s.grid.x && grid.y === s.grid.y
                && bright === s.light.bright && grey === s.light.grey;
        };
        return this._lightSources.find(predicate);
    },

    getLightSourceCountAt (grid) {
        let count = 0;
        for (const s of this._lightSources) {
            if (s.grid.x === grid.x && s.grid.y === grid.y)
                count += 1;
        }
        return count;
    },

    getLightSourcesAt (grid) {
        const sources = [];
        for (const s of this._lightSources) {
            if (s.grid.x === grid.x && s.grid.y === grid.y)
                sources.push(s);
        }
        return sources;
    },

    _doReveal (startGrid, brightDistance, greyDistance) {
        const totalDistance = brightDistance + greyDistance;
        const darkGrids = this._searchRevealGrids(startGrid, totalDistance);
        const greyGrids = this._searchRevealGrids(startGrid, brightDistance);
        darkGrids.forEach(grid => this._darkStates.revealGrid(grid));
        greyGrids.forEach(grid => this._greyStates.revealGrid(grid));
        return greyGrids;
    },

    _doConceal (startGrid, distance) {
        const greyGrids = this._searchRevealGrids(startGrid, distance);
        greyGrids.forEach(grid => this._greyStates.concealGrid(grid));
        return greyGrids;
    },

    _createSearchMethod () {
        const getNeighbors = next => {
            if (this.tiledMapCtrl.isBlockViewAt(next)) return [];

            const grids = [];
            for (const offset of FOUR_DIRECTIONS) {
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
            visited[startGrid.y][startGrid.x] = true;
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

    _createFogStates (layerName, IDS) {
        const states = [];
        const revealCounts = [];
        for (let y = 0; y <= this._mapSize.height; ++y) {
            states[y] = new Array(this._mapSize.width).fill(0);
            revealCounts[y] = new Array(this._mapSize.width).fill(0);
        }
        
        const getFogIndex = (x, y) => {
            return (states[y][x] & FogFlag.FOG_MASK) >>> 0;
        };

        const isRevealedPoint = (point) => {
            for (const offset of POINT_GRIDS) {
                const x = point.x + offset[0];
                const y = point.y + offset[1];
                if (this._isValidGridXY(x, y) && (states[y][x] & offset[3]))
                    return true;
            }
            return false;
        };

        const revealPoint = (point) => {
            for (const offset of POINT_GRIDS) {
                const x = point.x + offset[0];
                const y = point.y + offset[1];
                if (this._isValidGridXY(x, y)) {
                    let fogInex = getFogIndex(x, y) + offset[2];
                    fogInex = Math.min(fogInex, MAX_FOG_INDEX);
    
                    let flags = (states[y][x] & FogFlag.FOG_ALL | offset[3]) >>> 0;
                    states[y][x] = (flags | fogInex) >>> 0;
    
                    const id = IDS[fogInex];
                    this.tiledMapCtrl.setTileIdAt({x, y}, id, layerName);
                }
            }
        };

        const concealPoint = (point) => {
            for (const offset of POINT_GRIDS) {
                const x = point.x + offset[0];
                const y = point.y + offset[1];
                if (this._isValidGridXY(x, y)) {
                    let fogInex = getFogIndex(x, y) - offset[2];
                    fogInex = Math.max(fogInex, 0);
    
                    let flags = (states[y][x] & FogFlag.FOG_ALL) >>> 0;
                    flags = (flags & (~(FogFlag.FOG_ALL & offset[3]))) >>> 0;
                    states[y][x] = (flags | fogInex) >>> 0;
    
                    const id = IDS[fogInex];
                    this.tiledMapCtrl.setTileIdAt({x, y}, id, layerName);
                }
            }
        };

        return {
            updateTile: (x, y) => {
                const id = IDS[getFogIndex(x, y)];
                this.tiledMapCtrl.setTileIdAt({x, y}, id, layerName);
            },

            revealGrid: (grid) => {
                revealCounts[grid.y][grid.x] += 1;
                if (revealCounts[grid.y][grid.x] > 1) return;

                for (const offset of GRID_POINTS) {
                    const point = cc.v2(grid.x + offset[0], grid.y + offset[1]);
                    if (!this._isValidPointXY(point.x, point.y)) continue;
                    if (isRevealedPoint(point)) continue;
        
                    revealPoint(point);
                }
            },

            concealGrid: (grid) => {
                if (revealCounts[grid.y][grid.x] === 0) return;
                
                revealCounts[grid.y][grid.x] -= 1;
                if (revealCounts[grid.y][grid.x] > 0) return;

                for (const offset of GRID_POINTS) {
                    const point = cc.v2(grid.x + offset[0], grid.y + offset[1]);
                    if (!this._isValidPointXY(point.x, point.y)) continue;
                    if (!isRevealedPoint(point)) continue;

                    concealPoint(point);
                }
            },

            getRevealCountAt: (grid) => {
                return revealCounts[grid.y][grid.x];
            },
        };
    },

    _isValidPointXY (x, y) {
        return x >= 0 && x <= this._mapSize.width
            && y >= 0 && y <= this._mapSize.height;
    },

    _isValidGridXY (x, y) {
        return x >= 0 && x < this._mapSize.width
            && y >= 0 && y < this._mapSize.height;
    },

    greyFogStatesMap (grid, distance = 7) {
        const minX = grid.x - distance, maxX = grid.x + distance;
        const minY = grid.y - distance, maxY = grid.y + distance;
        const retStr = [];
        for (let y = minY; y <= maxY; ++y) {
            const rowStr = [];
            for (let x = minX; x <= maxX; ++x) {
                if (x === grid.x && y === grid.y) {
                    rowStr.push('X');
                    continue;
                }

                if (this._isValidGridXY(x, y)) {
                    rowStr.push(this._greyStates.getRevealCountAt(cc.v2(x, y)));
                } else {
                    rowStr.push(0);
                }
            }
            retStr.push(rowStr.join(' '));
        }
        return retStr.join('\n');
    }
});
