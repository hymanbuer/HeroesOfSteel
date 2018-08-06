
const UiHelper = require('UiHelper');
const UiConfig = require('UiConfig');
const UiCharacterDialog = require('UiCharacterDialog');
const CharacterControl = require('CharacterControl');
const Timeline = require('Timeline');

class PlotParser {
	constructor (world) {
        this.world = world;
	}

	parse (plot) {
		if (!(plot instanceof Array))
			plot = plot ? [plot] : [];
		
		const asyncFuncs = [];
		plot.forEach(obj => {
			if (obj instanceof Array) {
				const fns = obj.map(o => this._parseCmd(o));
				asyncFuncs.push(fns);
			} else {
				asyncFuncs.push(this._parseCmd(obj));
			}
		});

		return Timeline.create(asyncFuncs);
	}

	_parseCmd (obj) {
		if (typeof this[obj.cmd] !== 'function')
			throw new Error(`don't support cmd <${obj.cmd}>`);

		return this[obj.cmd](obj);
	}

    // --------------- System ---------------

    SYS_SHOW_DIALOG (args) {
        return ()=> new Promise((resolve, reject) => {
            const options = {hideMask: true, hideTips: true};
            const p = UiHelper.instance.showUi(UiConfig.UiCharacterDialog, options);
            p.then(ui => {
                ui.ondestroy = ()=> resolve();
                ui.getComponent(UiCharacterDialog).talkList = args.dialog;
            });
            p.catch(err => reject(err));
        });
    }

	SYS_DELAY_TIME (args) {
        return ()=> new Promise((resolve, reject) => {
            this.world.scheduleOnce(resolve, args.delay)
        });
    }

    SYS_PLAY_AUDIO (args) {
        return ()=> new Promise((resolve, reject) => {
            cc.log('cmd -> SYS_PLAY_AUDIO');
            resolve();
        });
    }
    
    // --------------- Character ---------------
    
    CHAR_ADD (args) {
        return ()=> new Promise((resolve, reject) => {
            this.world.addCharacter(args, resolve);
        });
    }
    
    CHAR_REMOVE (args) {
		return ()=> new Promise((resolve, reject) => {
            this.world.removeCharacterByTag(args.tag);
            resolve();
        });
    }
    
    CHAR_FOLLOW_PATH (args) {
		return ()=> new Promise((resolve, reject) => {
            const char = this.world.getCharacterByTag(args.tag);
            const ctrl = char.getComponent(CharacterControl);
            const posList = args.path.map(grid => this.world.getPositionAt(grid));
            ctrl.followPath(posList, resolve);
        });
    }

    CHAR_FACE_TO (args) {
		return ()=> new Promise((resolve, reject) => {
            const char = this.world.getCharacterByTag(args.tag);
            const ctrl = char.getComponent(CharacterControl);
            const pos = this.world.getPositionAt(args.grid);
            ctrl.rotateTo(pos, resolve);
        });
    }

    // --------------- TiledMap ---------------

    MAP_REPLACE_TILE (args) {
        return ()=> new Promise((resolve, reject) => {
            this.world.setTileIdAt(args.grid, args.id, args.layerName);
            resolve();
        });
    }

    // --------------- Camera ---------------

    CAM_PLACE_ON (args) {
        return ()=> new Promise((resolve, reject) => {
            this.world.placeCameraOn(args.grid);
            resolve();
        });
    }

    CAM_MOVE_ON (args) {
        return ()=> new Promise((resolve, reject) => {
            this.world.moveCameraOn(args.grid, resolve);
        });
    }

	// ...
}

module.exports = PlotParser;
