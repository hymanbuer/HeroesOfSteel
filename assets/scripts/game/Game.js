
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
    },


    onTouchWorld (worldPos) {
        // const pos = this.layerBackground.node.convertTouchToNodeSpaceAR(touch);
        // const targetGridX = Math.floor((pos.x+0.5) / this.tileSize.width);
        // const targetGridY = this.mapSize.height - Math.floor((pos.y+0.5) / this.tileSize.height);
        // const target = this.graph.grid2index(targetGridX, targetGridY);
        // cc.log(pos, targetGridX, targetGridY);
        cc.log(worldPos);

    },
});
