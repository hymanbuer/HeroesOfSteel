
const IndexedPQ = require('IndexedPriorityQueue');

class AStarSearch {
    constructor (graph, maxSize, heuristic) {
        this._graph = graph;
        this._gCosts = new Array(maxSize + 1).fill(0);
        this._fCosts = new Array(maxSize + 1).fill(0);
        this._route = new Array(maxSize + 1).fill(0);
        this._closed = new Array(maxSize + 1).fill(false);
        this._visited = new Array(maxSize + 1).fill(false);
        this._dirty = new Array();
        this._pq = new IndexedPQ((index1, index2) => {
            return this._fCosts[index1] > this._fCosts[index2];
        }, maxSize);
        this._heuristic = heuristic;
        this.clear();
    }

    search (start, target) {
        this.clear();
        this._pq.set(start);
        this._start = this._closest = start;
        this._target = target;
        while (this._pq.size > 0) {
            const current = this._pq.pop();
            if (current === target) {
                this._closest = this._target;
                return true;
            }

            this._closed[current] = true;
            for (const next of this._graph.getNeighbors(current)) {
                if (this._closed[next]) continue;

                const g = this._gCosts[current] + this._graph.getCost(current, next);
                if (!this._visited[next] || g < this._gCosts[next]) {
                    if (!this._visited[next]) this._dirty.push(next);

                    if (this._gCosts[this._closest] === 0 || g < this._gCosts[this._closest])
                        this._closest = next;

                    this._visited[next] = true;
                    this._gCosts[next] = g;
                    this._fCosts[next] = g + this._heuristic(next, target);
                    this._route[next] = current;
                    this._pq.set(next);
                }
            }
        }
        return false;
    }

    path () {
        if (this._start === 0 || this._closest === this._start)
            return [];

        const path = [];
        let node = this._closest;
        path.unshift(node);
        while (node != this._start && this._route[node] != 0) {
            node = this._route[node];
            path.unshift(node);
        }
        return path;
    }

    clear () {
        this._start = 0;
        this._target = 0;
        this._closest = 0;
        for (const index of this._dirty) {
            this._gCosts[index] = 0;
            this._fCosts[index] = 0;
            this._route[index] = 0;
            this._closed[index] = false;
            this._visited[index] = false;
        }
        this._pq.clear(this._dirty);
        this._dirty = [];
    }
}

module.exports = AStarSearch;