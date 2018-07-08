
function checkType(type) {
    if (typeof type !== 'string' || type === '')
        throw new Error('type should be a non empty string');
}

function checkCallback(callback) {
    if (typeof callback !== 'function')
        throw new Error('callback should be a function');
}

function checkTarget(target) {
    if (typeof target !== 'object')
        throw new Error('target should be an object');
}

function checkArguments(args) {
    const {type, callback, target} = args || {};
    checkType(type);
    checkCallback(callback);
    checkTarget(target);
}

class ObjectEventDispatcher {
    constructor () {

    }

    once (type, callback, target) {
        checkArguments({type, callback, target});

    }

    on (type, callback, target) {
        checkArguments({type, callback, target});
    }

    off (type, callback, target) {
        checkArguments({type, callback, target});
    }

    offByType (type) {
        checkArguments({type});
    }

    offByTarget (target) {
        checkArguments({target});
    }

    dispatch (type, data) {

    }

    clear () {

    }
}

const singleton = new ObjectEventDispatcher();
module.exports = singleton;
