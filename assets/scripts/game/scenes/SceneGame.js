
const LoaderHelper = require('CCLoaderHelper');
const SkeletonHelper = require('SkeletonHelper');

const TiledMapControl = require('TiledMapControl');
const CameraControl = require('CameraControl');
const CharacterControl = require('CharacterControl');
const HudControl = require('HudControl');
const FogSystem = require('FogSystem');

const PlotParser = require('PlotParser');
const PlotConfig = require('PlotConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        tildMapCtrl: TiledMapControl,
        cameraCtrl: CameraControl,
        hudControl: HudControl,
        inputHandler: cc.Node,
        fogSystem: FogSystem,
    },

    onLoad () {
        this._plotParser = new PlotParser(this);
        this.tildMapCtrl.node.on('moveend', this.onCharacterMoveEnd, this);
    },

    start () {
        this.scheduleOnce(()=> {
            this.showPlot(PlotConfig.startPlot);
        }, 0);
    },

    showPlot (plot) {
        const timeline = this._plotParser.parse(plot);
        this.inputHandler.active = false;
        this.hudControl.node.active = false;
        timeline().then(()=> {
            this.inputHandler.active = true;
            this.hudControl.node.active = true;
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

    addCharacter (args, callback) {
        LoaderHelper.loadResByUuid(args.uuid).then(skeletonData => {
            const node = SkeletonHelper.createHero(skeletonData, args.defaultSkin, 'Stand');
            const control = node.addComponent(CharacterControl);
            control.skeleton = node.skeleton;

            node.tag = args.tag;
            node.name = args.name;
            node.rotation = args.rotation || 0;
            node.position = this.tildMapCtrl.getPositionAt(args.grid);
            if (args.fadeIn) {
                node.opacity = 0;
                node.runAction(cc.fadeIn(0.5));
            }

            this.tildMapCtrl.addCharacter(node);
            this.fogSystem.reveal(args.grid);

            if (typeof callback === 'function') callback();
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

    // -----------

    onTouchWorld (worldPos) {
        const grid = this.tildMapCtrl.getGridAt(worldPos);
        if (this.lastGrid) {
            this.fogSystem.conceal(this.lastGrid);
        }
        this.lastGrid = grid;
        this.fogSystem.reveal(grid);
    },

    onCharacterMoveEnd (event) {
        const newPos = event.target.position;
        const oldPos = event.detail;
        const newGrid = this.tildMapCtrl.getGridAt(newPos);
        const oldGrid = this.tildMapCtrl.getGridAt(oldPos);
        this.fogSystem.conceal(oldGrid);
        this.fogSystem.reveal(newGrid);
    },
});
