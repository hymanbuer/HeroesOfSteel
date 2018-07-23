
const TiledMapControl = require('TiledMapControl');
const CameraControl = require('CameraControl');
const CharacterControl = require('CharacterControl');

cc.Class({
    extends: cc.Component,

    properties: {
        tildMapCtrl: TiledMapControl,
        cameraCtrl: CameraControl,
    },

    onLoad () {
        
    },

    start () {
        const pos = this.tildMapCtrl.getPositionAt({x: 11, y: 61});
        this.cameraCtrl.placeOn(pos);
    },
});
