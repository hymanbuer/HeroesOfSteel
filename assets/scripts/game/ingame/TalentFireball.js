
const CharacterControl = require('CharacterControl');
const MovingSpriteFactory = require('MovingSpriteFactory');
const Timeline = require('Timeline');

cc.Class({
    extends: cc.Component,

    properties: {
        char: CharacterControl,
    },

    start () {
        const startPos = this.char.getBonePosition('Spell Ball');
        const targetPos = cc.v2(100, 100);
        const moveSpeed = 500;

        const castSpell = ()=> {
            this.char.play('Cast Spell');
            return Promise.resolve();
        };
        const createDelay = ()=> {
            return new Promise(resolve => this.scheduleOnce(resolve, 0.5));
        }
        const addMovingSprite = ()=> {
            return MovingSpriteFactory.instance.addMovingSprite(
                'tile_flame_attack',
                startPos, targetPos, moveSpeed);
        };

        const funcs = [
            [castSpell, createDelay],
            addMovingSprite,
        ];
        Timeline.create(funcs)().then(()=> {
            cc.log('######### finish');
        });
    },
});