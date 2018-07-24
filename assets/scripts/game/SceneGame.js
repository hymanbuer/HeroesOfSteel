
const LoaderHelper = require('CCLoaderHelper');
const SkeletonHelper = require('SkeletonHelper');

const TiledMapControl = require('TiledMapControl');
const CameraControl = require('CameraControl');
const CharacterControl = require('CharacterControl');

const PlotParser = require('PlotParser');
const PlotConfig = require('PlotConfig');



cc.Class({
    extends: cc.Component,

    properties: {
        tildMapCtrl: TiledMapControl,
        cameraCtrl: CameraControl,
    },

    onLoad () {
        this._plotParser = new PlotParser(this);
    },

    start () {
        this.placeCameraOn(cc.v2(7, 65));

        this._test_plot();
    },

    _test_plot () {
        const plot = PlotConfig.startPlot;
        const action = this._plotParser.parse(plot);
        this.node.runAction(action);
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
    createCharacter (args, callback) {
        LoaderHelper.loadResByUuid(args.uuid).then(skeletonData => {
            const node = SkeletonHelper.createHero(skeletonData, 'Unarmed', 'Stand');
            node.tag = args.tag;
            node.name = args.name;
            node.position = this.tildMapCtrl.getPositionAt(args.grid);
            this.tildMapCtrl.addEntity(node);
        });
    },
});
