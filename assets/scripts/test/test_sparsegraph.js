
const SparseGraph = require('SparseGraph');

const AStarSearch = require('AStarSearch');
const performance = window.performance;

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
        
    },

    start () {
        const graph = new SparseGraph();
        // cc.log('-------- empty graph ---------');
        // cc.log(graph.toString());

        // cc.log('-------- add nodes -----------');
        const n = 50;
        const map = [];
        for (let y = 0; y < n; ++y) {
            map.push([]);
            for (let x = 0; x < n; ++x) {
                if (Math.random() > 0.3) {
                    const node = {};
                    node.index = graph.nextNodeIndex;
                    node.x = x;
                    node.y = y;
                    graph.addNode(node);
                    map[y][x] = node;
                }
            }
        }
        for (let y = 0; y < n; ++y) {
            for (let x = 0; x < n; ++x) {
                const node = map[y][x];
                if (!node) continue;

                const directions = EIGHT_DIRECTIONS;
                for (const direction of directions) {
                    const row = y + direction[0];
                    const col = x + direction[1];
                    if (col < 0 || col >= n || row < 0 || row >= n)
                        continue;

                    if (map[row][col]) {
                        const edge = {}
                        edge.from = node.index;
                        edge.to = map[row][col].index;
                        edge.cost = 1;
                        graph.addEdge(edge);
                    }
                }
            }
        }
        const func = index => {
            const node = graph.getNode(index);
            return `${index} (${node.x}, ${node.y})`;
        };
        // cc.log(graph.toString(func));

        // cc.log('-------- get neighbors --------');
        // cc.log(graph.getNodeNeighbors(0));

        cc.log('--------- test serach --------');
        const heuristic = (index1, index2) => {
            const node1 = graph.getNode(index1);
            const node2 = graph.getNode(index2);
            const [x1, y1, x2, y2] = [node1.x, node1.y, node2.x, node2.y];
            const D = 1;
            const D2 = Math.SQRT2;
            const d1 = Math.abs(x1 - x2);
            const d2 = Math.abs(y1 - y2);
            return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
        };
        const astar = new AStarSearch(graph, n*n, heuristic);
        // for (let y = 0; y < n; ++y) {
        //     for (let x = 0; x < n; ++x) {
        //         const node = map[y][x];
        //         if (node) {
        //             const found = astar.search(0, node.index);
        //             cc.log(found, node.index);
        //             // if (found) {
        //             //     cc.log(astar.path);
        //             // }
        //         }
        //     }
        // }
        let sTime = performance ? performance.now() : new Date().getTime();
        if (!map[n-1][n-1]) {
            const node = {};
            node.index = graph.nextNodeIndex;
            node.x = n-1;
            node.y = n-1;
            graph.addNode(node);
            map[n-1][n-1] = node;
        }
        const found = astar.search(0, map[n-1][n-1].index);
        let fTime = performance ? performance.now() : new Date().getTime();
        cc.log('--- search: ', found, fTime - sTime);
    },

    
});
