
const IndexedPQ = require('IndexedPriorityQueue');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    start () {
        this.testAscending();
        this.testDescending();
        this.testUpdate();
    },

    testAscending () {
        const arr = [3, 54, 1, 5, 2];
        const compare = (a, b) => arr[a-1] > arr[b-1];
        
        const pq = new IndexedPQ(compare, arr.length);
        const setSeq = [2, 1, 5, 3, 4];
        for (const index of setSeq) {
            pq.set(index);
        }
        cc.log('---- test ascending ----', pq.size);
        while (pq.size > 0) {
            const index = pq.pop();
            cc.log(arr[index - 1]);
        }
    },

    testDescending () {
        const arr = [3, 54, 1, 5, 2];
        const compare = (a, b) => arr[b-1] > arr[a-1];
        
        const pq = new IndexedPQ(compare, arr.length);
        const setSeq = [2, 1, 5, 3, 4];
        for (const index of setSeq) {
            pq.set(index);
        }
        cc.log('---- test descending ----', pq.size);
        while (pq.size > 0) {
            const index = pq.pop();
            cc.log(arr[index - 1]);
        }
    },

    testUpdate () {
        const arr = [3, 54, 1, 5, 2];
        const compare = (a, b) => arr[a-1] > arr[b-1];
        
        const pq = new IndexedPQ(compare, arr.length);
        const setSeq = [2, 1, 5, 3, 4];
        for (const index of setSeq) {
            pq.set(index);
        }

        arr[2 - 1] = -1;
        pq.set(2);

        cc.log('---- test update ----', pq.size);
        while (pq.size > 0) {
            const index = pq.pop();
            cc.log(arr[index - 1]);
        }
    },
});
