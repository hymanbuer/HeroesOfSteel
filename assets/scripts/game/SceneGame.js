
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
    },

    start () {
        this.placeCameraOn(cc.v2(7, 65));
        
        // this.showPlot(PlotConfig.startPlot);
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

    // cmd: 'CHAR_ADD',
    // uuid: '',
    // name: 'Char Name',
    // tag: 101,
    // grid: {x: 18, y: 61}
    addCharacter (args, callback) {
        LoaderHelper.loadResByUuid(args.uuid).then(skeletonData => {
            const node = SkeletonHelper.createHero(skeletonData, 'Unarmed', 'Stand');
            const control = node.addComponent(CharacterControl);
            control.skeleton = node.skeleton;

            node.tag = args.tag;
            node.name = args.name;
            node.rotation = args.rotation || 0;
            node.position = this.tildMapCtrl.getPositionAt(args.grid);
            this.tildMapCtrl.addCharacter(node);

            this.fogSystem.reveal(args.grid, 4, 2);
        }).finally(()=> {
            if (typeof callback === 'function') callback();
        });
    },

    removeCharacterByTag (nodeOrTag) {
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
            this.fogSystem.conceal(this.lastGrid, 6);
        }
        this.lastGrid = grid;
        this.fogSystem.reveal(grid, 4, 2);
    },
});
