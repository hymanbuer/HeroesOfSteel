
const Dispatcher = require('ComponentEventDispatcher');

cc.Class({
    extends: cc.Component,

    properties: {
        sprite: cc.Sprite,
    },

    start () {
        // this.test_args();
        // this.test_on_dispatch();
        this.test_invalid_target();
        // this.test_once();
        // this.test_off_by_type();
        // this.test_off_by_target();
        // this.test_clear();
    },

    test_args () {
        cc.log('------------ test_args ------------');
        const type = 'xx';
        const callback = function () {
            cc.log('this is callback.');
            cc.log(this);
        }
        const target = this;

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

    test_on_dispatch () {
        cc.log('------------ test_on_dispatch ------------');
        Dispatcher.on('testevent', this.onTestEvent, this);
        Dispatcher.dispatch('testevent', 2, 'xx');
        Dispatcher.dispatch('testevent2', 1, 'aa');

        this.scheduleOnce(function () {
            Dispatcher.dispatch('testevent', 3, 'bb');
        }, 1);
    },

    test_invalid_target () {
        cc.log('------------ test_invalid_target ------------');
        Dispatcher.on('testevent', this.onTestEvent, this.sprite);
        Dispatcher.dispatch('testevent', 5, 'dd');
        this.scheduleOnce(function () {
            cc.log('------- scheduleOnce');
            Dispatcher.dispatch('testevent', 4, 'cc');
        }, 5);
        this.node.removeComponent(this.sprite);
    },
    
    test_once () {
        cc.log('------------ test_once ------------');
        Dispatcher.once('testevent', this.onTestEvent, this);
        Dispatcher.dispatch('testevent', 5, 'dd');
        Dispatcher.dispatch('testevent', 6, 'ee');
        this.scheduleOnce(function () {
            Dispatcher.dispatch('testevent', 4, 'cc');
        }, 1);
    },

    test_off_by_type () {
        cc.log('------------ test_off_by_type ------------');
        Dispatcher.on('testevent', this.onTestEvent, this);
        Dispatcher.dispatch('testevent', 5, 'dd');
        Dispatcher.offByType('testevent');
        Dispatcher.dispatch('testevent', 6, 'ee');
        this.scheduleOnce(function () {
            Dispatcher.dispatch('testevent', 4, 'cc');
        }, 1);
    },

    test_off_by_target () {
        cc.log('------------ test_off_by_target ------------');
        Dispatcher.on('testevent', this.onTestEvent, this);
        Dispatcher.dispatch('testevent', 5, 'dd');
        Dispatcher.offByTarget(this);
        Dispatcher.dispatch('testevent', 6, 'ee');
        this.scheduleOnce(function () {
            Dispatcher.dispatch('testevent', 4, 'cc');
        }, 1);
    },

    test_clear () {
        cc.log('------------ test_clear ------------');
        Dispatcher.on('testevent', this.onTestEvent, this);
        Dispatcher.dispatch('testevent', 5, 'dd');
        Dispatcher.clear();
        Dispatcher.dispatch('testevent', 6, 'ee');
        this.scheduleOnce(function () {
            Dispatcher.dispatch('testevent', 4, 'cc');
        }, 1);
    },

    onTestEvent(type, a, b) {
        cc.log(type, a, b);
    },
});
