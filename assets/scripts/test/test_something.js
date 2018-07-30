
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        
    },

    start () {
        const p = new Promise((resolve, reject) => {
            this.scheduleOnce(()=> {
                cc.log('this is promise!!');
                resolve();
            }, 0.5);
        });

        p.then(()=> {
            cc.log('finish my promise!');
        });
    },

    
});
 