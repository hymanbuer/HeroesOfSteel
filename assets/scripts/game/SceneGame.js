
const GridGraph = require('GridGraph');
const AStarSearch = require('AStarSearch');
const DisjointSet = require('DisjointSet');
const time = () => window.performance ? window.performance.now() : new Date().getTime();

const UiHelper = require('UiHelper');

const fogIds = [
    0, 4, 8, 12,
    1, 5, 9, 13,
    2, 6, 10, 14,
    3, 7, 11, 15,
];

const FOUR_DIRECTIONS = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
];

const DiagonalDrections = [
    [0, 0, 2],
    [-1, -1, 4],
    [0, -1, 8],
    [-1, 0, 1],
];

cc.Class({
    extends: cc.Component,

    properties: {
        backgroundLayerName: 'Background',
        foregroundLayerName: 'Foreground',

        tiledMap: cc.TiledMap,
        camera: cc.Node,
        player: cc.Node,
    },

    onLoad () {
        
    },

    start () {
        this.camera.x = this.player.x;
        this.camera.y = this.player.y;

        this.mapSize = this.tiledMap.getMapSize();
        this.tileSize = this.tiledMap.getTileSize();
        this.layerBackground = this.tiledMap.getLayer(this.backgroundLayerName);
        this.layerForeground = this.tiledMap.getLayer(this.foregroundLayerName);

        const mapStr = [];
        const grids = [];
        for (let y = 0; y < this.mapSize.height; ++y) {
            const rowStr = [];
            for (let x = 0; x < this.mapSize.width; ++x) {
                const gid = this.layerBackground.getTileGIDAt(x, y);
                let char = '#';
                if (gid > 0) {
                    for (const key in this.tiledMap.getPropertiesForGID(gid) || {}) {
                        if (key === 'm') {
                            char = ' ';
                            grids.push({x, y});
                            break;
                        }
                    }
                }
                rowStr.push(char);
            }
            mapStr.push(rowStr.join(' '));
        }
        // cc.log(mapStr.join('\n'));

        this.graph = new GridGraph(this.mapSize.height, this.mapSize.width, grids, true);
        const heuristic = GridGraph.createHeuristic(this.graph, GridGraph.HeuristicType.Diagonal);
        this.astar = new AStarSearch(this.graph, this.graph.maxSize, heuristic);

        this.pos2grid = (pos) => {
            const x = Math.floor((pos.x+0.5) / this.tileSize.width);
            const y = (this.mapSize.height-1) - Math.floor((pos.y+0.5)/this.tileSize.height);
            return cc.v2(x, y);
        };

        this.layerFog = this.tiledMap.getLayer('Fog');
        this.fogTileset = this.layerFog.getTileSet();

        const self = this;
        this.followPath = (path) => {
            const actions = [];
            cc.log('----- follow path -------');
            for (const index of path) {
                const grid = this.graph.index2grid(index);
                const pos = this.getPositionAt(grid);
                // actions.push(cc.callFunc(function () {
                //     const tile = self.layerFog.getTileAt(grid);
                //     if (tile) tile.runAction(cc.fadeOut(0.2));
                // }));
                actions.push(cc.moveTo(0.2, pos));
                actions.push(cc.callFunc(function () {
                    self.lightGridByDistance(grid, 7);
                }));
                // cc.log(grid, pos);
            }
            this.player.runAction(cc.sequence(actions));
        };

        this.setTo = (pos) => {
            // this.camera.x = this.player.x = pos.x;
            // this.camera.y = this.player.y = pos.y;
            this.player.x = pos.x;
            this.player.y = pos.y;
        };

        this.getPositionAt = (grid) => {
            const pos = this.layerBackground.getPositionAt(grid);
            pos.x += this.tileSize.width/2.0;
            pos.y += this.tileSize.height/2.0;
            return pos;
        }

        this.disjointSet = new DisjointSet(this.graph.maxSize);
        for (const grid of grids) {
            const from = this.graph.grid2index(grid.x, grid.y);
            const neighbors = this.graph.getNodeNeighbors(from);
            for (const to of neighbors) {
                this.disjointSet.union(from, to);
            }
        }

        // cc.log(this.layerBackground.getTileSet());
        // cc.log(this.layerForeground.getTileSet());
        // cc.log(this.layerFog.getTileSet());

        this.tiledMap.getObjectGroup('Rooms').node.destroy();
        this.tiledMap.getObjectGroup('Blocks').node.destroy();

        this.fogStates = [];
        this.fogLightedPoints = [];
        for (let y = 0; y < this.mapSize.height; ++y) {
            this.fogStates.push(new Array(this.mapSize.width).fill(0));
            this.fogLightedPoints.push(new Array(this.mapSize.width + 1).fill(false))
            for (let x = 0; x < this.mapSize.width; ++x) {
                self.layerFog.setTileGID(self.fogTileset.firstGid, {x, y});
            }
        }
        this.fogLightedPoints.push(new Array(this.mapSize.width + 1).fill(false))

        self.lightGridByDistance({x: 41, y: 26}, 7);

        this.scheduleOnce(function () {
            UiHelper.instance.showUi('prefabs/game/ui_world_map');
        }, 2);
    },

    update (dt) {
        // if (this.player.getNumberOfRunningActions() > 0) {
        //     this.camera.x = this.player.x;
        //     this.camera.y = this.player.y;
        // }
    },

    onTouchWorld (worldPos) {
        const startGrid = this.pos2grid(this.player.getPosition());
        const start = this.graph.grid2index(startGrid.x, startGrid.y);
        const targetGrid = this.pos2grid(worldPos);
        const target = this.graph.grid2index(targetGrid.x, targetGrid.y);

        if (!this.disjointSet.same(start, target)) {
            cc.log('start and target is not in same set');
        }

        const beginTime = time();
        const isFound = this.astar.search(start, target);
        const endTime = time();
        // if (isFound) {
            this.player.stopAllActions();
            this.setTo(this.getPositionAt(startGrid));
            this.followPath(this.astar.path);
        // }

        // this.lightGrid(targetGrid);
        // this.lightGridByDistance(targetGrid, 5);
    },

    lightGrid (grid) {
        for (const dir of FOUR_DIRECTIONS) {
            const lightPoint = cc.v2(grid.x + dir[0], grid.y + dir[1]);
            if (lightPoint.x >= 0 && lightPoint.x <= this.mapSize.width
                && lightPoint.y >= 0 && lightPoint.y <= this.mapSize.height
                && !this.fogLightedPoints[lightPoint.y][lightPoint.x]) {

                this.fogLightedPoints[lightPoint.y][lightPoint.x] = true;
                for (const dir2 of DiagonalDrections) {
                    const x = lightPoint.x + dir2[0];
                    const y = lightPoint.y + dir2[1];
                    if (x >= 0 && x < this.mapSize.width
                        && y >= 0 && y < this.mapSize.height) {
                        this.fogStates[y][x] = Math.min(this.fogStates[y][x] + dir2[2], fogIds.length - 1);
                        const fogId = fogIds[this.fogStates[y][x]];
                        const gid = fogId + this.fogTileset.firstGid;
                        this.layerFog.setTileGID(gid, {x, y});
                    }
                }
            }
        }

    },

    lightGridByDistance (grid, distance) {
        for (let y = -distance; y <= distance; ++y) {
            for (let x = -distance; x <= distance; ++x) {
                if (Math.abs(x) + Math.abs(y) > distance) continue;
                if (Math.abs(x) === distance) continue;
                if (Math.abs(y) === distance) continue;

                this.lightGrid(cc.v2(grid.x + x, grid.y + y));
            }
        }
    }
});
