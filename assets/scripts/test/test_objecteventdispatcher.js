
const Dispatcher = require('ObjectEventDispatcher');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    start () {
        this.test_args();
    },

    update (dt) {
        
    },

    test_args () {
        const type = 'xx';
        const callback = function () {
            cc.log('this is callback.');
            cc.log(this);
        }
        const target = {a: 1, b: 'target'};

        const callWith = function (type, callback, target) {
            cc.log('------------------------------')
            try {
                Dispatcher.on(type, callback, target);
            } catch (error) {
                cc.log(error.message);
            }
        }

        callWith();
        callWith(type);
        callWith(type, callback);
        callWith(type, callback, target);
    },
});
