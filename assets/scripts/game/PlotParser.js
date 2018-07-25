
const UiHelper = require('UiHelper');
const UiConfig = require('UiConfig');
const UiCharacterDialog = require('UiCharacterDialog');

const ConditionAction = cc.ActionInterval.extend({
    _condition: null,

    ctor: function (condition) {
        cc.ActionInterval.prototype.ctor.call(this, Number.MAX_SAFE_INTEGER);
        cc.assert(typeof condition === 'function');
        this._condition = condition;
    },

    isDone: function () {
        return typeof this._condition === 'function' && this._condition();
    },

    clone: function () {
        return new ConditionAction(this._condition);
    },

    update: function (dt) {
    },
});

class PlotParser {
	constructor (game) {
        this.game = game;
	}

	parse (plot) {
		if (!(plot instanceof Array))
			plot = plot ? [plot] : [];
		
		const actions = [];
		plot.forEach(obj => {
			if (obj instanceof Array) {
				const acts = [];
				obj.forEach( o => acts.push(this._parseCmd(o)) );
				actions.push(acts.length < 2 ? acts[0] : cc.spawn(acts));
			} else {
				actions.push(this._parseCmd(obj));
			}
		});

		return actions.length < 2 ? actions[0] : cc.sequence(actions);
	}

	_parseCmd (obj) {
		if (typeof this[obj.cmd] !== 'function')
			throw new Error(`don't support cmd <${obj.cmd}>`);

		return this[obj.cmd](obj);
	}

    // --------------- System ---------------

    SYS_SHOW_DIALOG (args) {
        let flag = false;
        const show = cc.callFunc(()=> {
            const options = {hideMask: true, hideTips: true};
            const p = UiHelper.instance.showUi(UiConfig.UiCharacterDialog, options);
            p.then(ui => {
                ui.ondestroy = ()=> flag = true;
                ui.getComponent(UiCharacterDialog).talkList = args.dialog;
            });
            p.catch(err => flag = true);
        });
        const finish = new ConditionAction(()=> flag);
        return cc.sequence(show, finish);
    }

	SYS_DELAY_TIME (args) {
		return cc.delayTime(args.delay);
    }

    SYS_PLAY_AUDIO (args) {
		return cc.callFunc( ()=> cc.log('cmd -> SYS_PLAY_AUDIO') );
    }
    
    // --------------- Character ---------------
    
    CHAR_ADD (args) {
		let flag = false;
        const create = cc.callFunc(()=> this.game.createCharacter(args, ()=> flag = true));
        const finish = new ConditionAction(()=> flag);
        return cc.sequence(create, finish);
    }
    
    CHAR_REMOVE (args) {
		return cc.callFunc( ()=> cc.log('cmd -> CHAR_REMOVE') );
    }
    
    CHAR_FOLLOW_PATH (args) {
		return cc.callFunc( ()=> cc.log('cmd -> CHAR_FOLLOW_PATH') );
    }

    CHAR_FACE_TO (args) {
		return cc.callFunc( ()=> cc.log('cmd -> CHAR_FACE_TO') );
    }

    // --------------- TiledMap ---------------

    MAP_REPLACE_TILE (args) {
        const replace = ()=> this.game.setTileIdAt(args.grid, args.id, args.layerName);
		return cc.callFunc(replace);
    }

    // --------------- Camera ---------------

    CAM_PLACE_ON (args) {
        const place = ()=> this.game.placeCameraOn(args.grid);
        return cc.callFunc(place);
    }

    CAM_MOVE_ON (args) {
        let flag = false;
        const move = cc.callFunc(()=> this.game.moveCameraOn(args.grid, ()=> flag = true));
        const finish = new ConditionAction(()=> flag);
        return cc.sequence(move, finish);
    }

	// ...
}

module.exports = PlotParser;
