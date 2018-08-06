
const HosWorld = require('HosWorld');
const HudControl = require('HudControl');

const PlotParser = require('PlotParser');
const PlotConfig = require('PlotConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        world: HosWorld,
        hudControl: HudControl,
        inputHandler: cc.Node,
    },

    onLoad () {
        this._plotParser = new PlotParser(this.world);
    },

    start () {
        this.world.init().then(()=> {
            this.showPlot(PlotConfig.startPlot);
        });
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

    // -----------

});
