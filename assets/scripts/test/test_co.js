
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        
    },

    start () {
        const fns = [];
        fns.push(()=> {
            return new Promise((resolve, reject) => {
                this.scheduleOnce(()=> {
                    cc.log('--- 1');
                    resolve();
                }, 1)
            });
        });

        fns.push(()=> {
            return new Promise((resolve, reject) => {
                this.scheduleOnce(()=> {
                    cc.log('--- 2');
                    resolve();
                }, 2)
            });
        });

        fns.push(()=> {
            return new Promise((resolve, reject) => {
                this.scheduleOnce(()=> {
                    cc.log('--- 3');
                    resolve();
                }, 1)
            });
        });

        fns.push(()=> {
            return new Promise((resolve, reject) => {
                this.scheduleOnce(()=> {
                    cc.log('--- 4');
                    resolve();
                }, 1)
            });
        });

        fns.push(()=> {
            return new Promise((resolve, reject) => {
                this.scheduleOnce(()=> {
                    cc.log('--- 5');
                    resolve();
                }, 1)
            });
        });

        const timeline = co.wrapTimeline([fns]);
        timeline().then(()=> {
            cc.log('---- go');
        });
    },

    
});
 