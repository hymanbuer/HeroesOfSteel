
const GridGraph = require('GridGraph');
const AStarSearch = require('AStarSearch');
const performance = window.performance;

cc.Class({
    extends: cc.Component,

    properties: {
        text: cc.Label,
    },

    start () {
        try {
            const n = 50;
            const m = 50;
            const grids = [];
            for (let y = 0; y < n; ++y) {
                for (let x = 0; x < n; ++x) {
                    const isWall = Math.floor(Math.random()*(1/0.3));
                    if (isWall !== 0) grids.push({x, y});
                }
            }
            const graph = new GridGraph(n, n, grids, true);
            // cc.log(graph.toString());

            cc.log('-------- ------ --------');
            // Manhattan
            // Diagonal
            const heuristic = GridGraph.createHeuristic(graph, GridGraph.HeuristicType.Diagonal);

            const astar = new AStarSearch(graph, graph.maxSize, heuristic);
            graph.addNodeByGrid(0, 0);
            graph.addNodeByGrid(m-1, m-1);
            // cc.log(graph.toString());

            cc.log('-------- ------ --------');
            const start = graph.grid2index(0, 0);

            const search = function () {
                const k = 10 + Math.floor((n - 10) * Math.random()) % n
                const target = graph.grid2index(k-1, k-1);
                const targetNode = graph.getNodeByIndex(target);
                cc.log(start, target, k, targetNode);

                let sTime = performance ? performance.now() : new Date().getTime();
                cc.log('--- search: ', astar.search(start, target));
                let fTime = performance ? performance.now() : new Date().getTime();
                cc.log('--- time: ', (fTime-sTime).toFixed(2));
                cc.log(astar.path());
                cc.log('-------- ------ --------');
            }
            this._search = search;
        } catch (error) {
            cc.log(error);
            cc.log(error.stack);
        }
    },

    search () {
        this._search();
    }

});
