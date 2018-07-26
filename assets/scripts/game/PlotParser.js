
const UiHelper = require('UiHelper');
const UiConfig = require('UiConfig');
const UiCharacterDialog = require('UiCharacterDialog');

class PlotParser {
	constructor (game) {
        this.game = game;
	}

	parse (plot) {
		if (!(plot instanceof Array))
			plot = plot ? [plot] : [];
		
		const asyncFuncs = [];
		plot.forEach(obj => {
			if (obj instanceof Array) {
				const acts = obj.map(o => this._parseCmd(o));
				asyncFuncs.push(acts);
			} else {
				asyncFuncs.push(this._parseCmd(obj));
			}
		});

		return co.wrapTimeline(asyncFuncs);
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
            this.game.scheduleOnce(resolve, args.delay)
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
            this.game.createCharacter(args, resolve);
        });
    }
    
    CHAR_REMOVE (args) {
		return ()=> new Promise((resolve, reject) => {
            cc.log('cmd -> CHAR_REMOVE');
            resolve();
        });
    }
    
    CHAR_FOLLOW_PATH (args) {
		return ()=> new Promise((resolve, reject) => {
            cc.log('cmd -> CHAR_FOLLOW_PATH');
            resolve();
        });
    }

    CHAR_FACE_TO (args) {
		return ()=> new Promise((resolve, reject) => {
            cc.log('cmd -> CHAR_FACE_TO');
            resolve();
        });
    }

    // --------------- TiledMap ---------------

    MAP_REPLACE_TILE (args) {
        return ()=> new Promise((resolve, reject) => {
            this.game.setTileIdAt(args.grid, args.id, args.layerName);
            resolve();
        });
    }

    // --------------- Camera ---------------

    CAM_PLACE_ON (args) {
        return ()=> new Promise((resolve, reject) => {
            this.game.placeCameraOn(args.grid);
            resolve();
        });
    }

    CAM_MOVE_ON (args) {
        return ()=> new Promise((resolve, reject) => {
            this.game.moveCameraOn(args.grid, resolve);
        });
    }

	// ...
}

module.exports = PlotParser;
