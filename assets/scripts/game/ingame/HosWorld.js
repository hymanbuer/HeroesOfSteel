
const LoaderHelper = require('CCLoaderHelper');
const SkeletonHelper = require('SkeletonHelper');

const TiledMapControl = require('TiledMapControl');
const FogSystem = require('FogSystem');
const CameraControl = require('CameraControl');
const CharacterControl = require('CharacterControl');
const HeroesManager = require('HeroesManager')

const Tags = require('Tags');

const GridGraph = require('GridGraph');
const AStarSearch = require('AStarSearch');
const DisjointSet = require('DisjointSet');
const Heuristic = require('Heuristic');

function createCharacter(uuid, defaultSkin, defaultAnimation = 'Stand') {
    return LoaderHelper.loadResByUuid(uuid).then(skeletonData => {
        const node = SkeletonHelper.createHero(skeletonData, defaultSkin, defaultAnimation);
        const control = node.addComponent(CharacterControl);
        control.skeleton = node.skeleton;
        return node;
    });
}

cc.Class({
    extends: cc.Component,

    properties: {
        tildMapCtrl: TiledMapControl,
        fogSystem: FogSystem,
        cameraCtrl: CameraControl,
    },

    onLoad () {
        this.node.on('moveend', this.onCharacterMoveEnd, this);
    },

    start () {
        
    },

    init () {
        return this.tildMapCtrl.init('maps/map_2_region_10')
            .then(()=> {
                this.fogSystem.init();
                this._initHeroes();
                this._initGraph();
                this._initSearch();
            });
    },

    placeCameraOn (grid) {
        const pos = this.tildMapCtrl.getPositionAt(grid);
        this.cameraCtrl.placeOn(pos);
    },

    moveCameraOn (grid, callback) {
        const pos = this.tildMapCtrl.getPositionAt(grid);
        this.cameraCtrl.moveOn(pos, callback);
    },

    setTileIdAt (grid, id, layerName) {
        this.tildMapCtrl.setTileIdAt(grid, id, layerName);
    },

    addCharacter (args) {
        return createCharacter(args.uuid, args.defaultSkin).then(node => {
            node.tag = args.tag;
            node.name = args.name;
            node.rotation = args.rotation || 0;
            node.position = this.tildMapCtrl.getPositionAt(args.grid);
            if (args.fadeIn) {
                node.opacity = 0;
                node.runAction(cc.fadeIn(0.5));
            }

            this.tildMapCtrl.addCharacter(node);
            node.disableFogEffect = args.disableFogEffect;
            if (!args.disableFogEffect)
                this.fogSystem.reveal(args.grid);

            if (args.tag >= Tags.HeroStart && args.tag <= Tags.HeroEnd) {
                this._heroesManager.addHero(node);
            }

            return node;
        });
    },

    removeCharacterByTag (nodeOrTag) {
        const node = this.tildMapCtrl.getCharacterByTag(nodeOrTag);
        if (node) {
            const grid = this.tildMapCtrl.getGridAt(node.position);
            this.fogSystem.conceal(grid);
        }
        this.tildMapCtrl.removeCharacterByTag(nodeOrTag);
    },

    getCharacterByTag (tag) {
        return this.tildMapCtrl.getCharacterByTag(tag);
    },

    getPositionAt (grid) {
        return this.tildMapCtrl.getPositionAt(grid);
    },

    selectHero (index) {
        const hero = this._heroesManager.selectHero(index);
        this.cameraCtrl.moveOn(hero.position);
    },

    selectNextHero () {
        const hero = this._heroesManager.selectNextHero();
        this.cameraCtrl.moveOn(hero.position);
    },

    // --------------------

    onTouchWorld (worldPos) {
        const grid = this.tildMapCtrl.getGridAt(worldPos);
        if (this.lastGrid) {
            this.fogSystem.conceal(this.lastGrid);
        }
        this.lastGrid = grid;
        this.fogSystem.reveal(grid);
    },

    onCharacterMoveEnd (event) {
        if (event.target.disableFogEffect) return;

        const newPos = event.target.position;
        const oldPos = event.detail;
        const newGrid = this.tildMapCtrl.getGridAt(newPos);
        const oldGrid = this.tildMapCtrl.getGridAt(oldPos);
        this.fogSystem.conceal(oldGrid);
        this.fogSystem.reveal(newGrid);
    },

    // ------------------

    _initHeroes () {
        this._heroesManager = new HeroesManager();

    },

    _initGraph () {
        const mapSize = this.tildMapCtrl.getMapSize();
        const walkableGrids = [];
        for (let y = 0; y < mapSize.height; ++y) {
            for (let x = 0; x < mapSize.width; ++x) {
                const grid = {x, y};
                if (this.tildMapCtrl.isWalkableAt(grid)) {
                    walkableGrids.push(grid);
                }
            }
        }
        this._worldGraph = new GridGraph(mapSize, walkableGrids, true);
    },

    _initSearch () {
        const heuristicType = Heuristic.Type.Diagonal;
        const index2grid = index => this._worldGraph.index2grid(index);
        const heuristc = Heuristic.create(heuristicType, index2grid);
        const getNeighbors = index => this._worldGraph.getNodeNeighbors(index);
        const getEdgeCost = (from, to) => this._worldGraph.getEdgeCost(from, to);
        this._worldSearch = new AStarSearch(this._worldGraph.maxSize, getNeighbors, getEdgeCost, heuristc);

        const start = this._worldGraph.grid2index(7, 62);
        const target = this._worldGraph.grid2index(9, 64);
        this._worldSearch.search(start, target);
        cc.log(this._worldSearch.path);
    },
});
