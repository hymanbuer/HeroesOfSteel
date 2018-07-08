
const GridGraph = require('GridGraph');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    start () {
        const graph = new GridGraph(5, 5, true);
        cc.log('-------- empty graph ---------');
        cc.log(graph.toString());

        cc.log('-------- add nodes -----------');
        for (let x = 0; x < 5; ++x) {
            for (let y = 0; y < 5; ++y) {
                if (Math.random() > 0.3) {
                    graph.addNodeByGrid(x, y);
                }
            }
        }
        cc.log(graph.toString());

        cc.log('-------- get neighbors --------');
        graph.addNodeByGrid(2, 2);
        cc.log(graph.getNeighbors(graph.grid2index(2, 2)));
    },

    
});
