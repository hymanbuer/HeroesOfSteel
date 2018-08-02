
const Timeline = require('Timeline');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        
    },

    start () {
        const fns = [
            (ret)=> Promise.resolve(ret + 1),
            (ret)=> Promise.resolve(ret + 2),
            (ret)=> Promise.reject(ret + 3),
            (ret)=> Promise.resolve(ret + 4),
        ];
        const timeline = Timeline.create(fns);
        timeline(0).then(result => {
            cc.log(result);
        }, (ff => {
            cc.log(ff);
        }));
    },

    
});
 