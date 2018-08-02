
const story = [
    'There was a time before out world was broken.',
    'The oldest among us still remember the shining kingdoms of Kallas and Relliar.',
    'But when four gods turned on the All-Father, the whole world broken with him.',
    ['The kingdoms of men fell - curshed by war, corruption and deceit.'],
    'In those final hours, the ancient druids, an order known as the Dhrogas, led the survivors into the underdeep.',
    'While the Dark Four ravage the surface, we carve out a fragile existence underground.',
    'We live in grim days, in times of darkness and flame.',
    'Ours is an age of warring gods, of blood and steel ...',
    'An age of heroes ...',
];

cc.Class({
    extends: cc.Component,

    properties: {
        text: cc.Label,
        fire: cc.ParticleSystem,
    },

    start () {
        const LEFT = cc.Label.HorizontalAlign.LEFT;
        const CENTER = cc.Label.HorizontalAlign.CENTER;
        const showLine = (line, callback) => {
            const acts = [];
            acts.push(cc.callFunc(()=> {
                this.text.string = line;
                this.text.horizontalAlign = line.length >= 60 ? LEFT : CENTER;
            }));
            acts.push(cc.fadeIn(0.5));
            if (callback) acts.push(cc.callFunc(callback));
            acts.push(cc.delayTime(2.0));
            acts.push(cc.fadeOut(0.5));
            acts.push(cc.delayTime(0.5));
            return cc.sequence(acts);
        };
        const showFire = ()=> {
            this.fire.resetSystem();
        };

        const actions = [];
        actions.push(cc.delayTime(1.0));
        for (const line of story) {
            if (typeof line === 'string') actions.push(showLine(line));
            else actions.push(showLine(line[0], showFire));
        }
        actions.push(cc.delayTime(1.0));
        actions.push(cc.callFunc(()=> {
            cc.director.loadScene('loading');
        }));
        this.text.node.opacity = 0;
        this.text.node.runAction(cc.sequence(actions));
    },

    onClickSkip () {
        cc.director.loadScene('loading');
    },
});
