
const GridGraph = require('GridGraph');
const AStarSearch = require('AStarSearch');
const time = () => window.performance ? window.performance.now() : new Date().getTime();

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

        this.moveTo = (pos) => {
            this.camera.x = this.player.x = pos.x;
            this.camera.y = this.player.y = pos.y;
        };
    },


    onTouchWorld (worldPos) {
        const startGrid = this.pos2grid(this.player.getPosition());
        const start = this.graph.grid2index(startGrid.x, startGrid.y);
        const targetGrid = this.pos2grid(worldPos);
        const target = this.graph.grid2index(targetGrid.x, targetGrid.y);
        const beginTime = time();
        const isFound = this.astar.search(start, target);
        const endTime = time();
        if (isFound) {
            this.moveTo(worldPos);
        }
        cc.log(worldPos, startGrid, targetGrid);
        cc.log(isFound, endTime-beginTime);
    },
});
