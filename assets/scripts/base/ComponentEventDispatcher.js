
function checkType(type) {
    if ((typeof type !== 'string') || type === '')
        throw new Error('type should be a non empty string');
}

function checkCallback(callback) {
    if ((typeof callback) !== 'function')
        throw new Error('callback should be a function');
}

function checkTarget(target) {
    if (!(target instanceof cc.Component))
        throw new Error('target should be cc.Component');
}

function checkArguments(...args) {
    const [type, callback, target] = args;
    if (type) checkType(type);
    if (callback) checkCallback(callback);
    if (target) checkTarget(target);
}

class ComponentEventDispatcher {
    constructor () {
        this._callbackSet = new Set();
        this._typeMap = new Map();
        this._targetMap = new Map();
    }

    once (type, callback, target) {
        checkArguments(type, callback, target);
        if (this._callbackSet.has(callback)) return;

        const onceWrapper = (type, ...args) => {
            this.off(type, onceWrapper, target);
            callback.call(target, type, ...args);
        };
        this.on(type, onceWrapper, target);
    }

    on (type, callback, target) {
        checkArguments(type, callback, target);
        if (this._callbackSet.has(callback)) return;

        const cbObjList = this._typeMap.get(type) || [];
        const cbTypeList = this._targetMap.get(target) || [];
        if (cbObjList.length === 0) this._typeMap.set(type, cbObjList);
        if (cbTypeList.length === 0) this._targetMap.set(target, cbTypeList);

        cbObjList.push({callback, target});
        cbTypeList.push({callback, type});
        this._callbackSet.add(callback);
    }

    off (type, callback, target) {
        checkArguments(type, callback, target);
        if (!this._callbackSet.has(callback)) return;

        const cbObjList = this._typeMap.get(type) || [];
        const cbTypeList = this._targetMap.get(target) || [];
        let cbObjIndex = cbObjList.findIndex(o => o.callback === callback);
        let cbTypeIndex = cbTypeList.findIndex(o => o.callback === callback);
        this._callbackSet.delete(callback);
        if (cbObjIndex >= 0) cbObjList.splice(cbObjIndex, 1);
        if (cbTypeIndex >= 0) cbTypeList.splice(cbTypeIndex, 1);
    }

    offByType (type) {
        const cbObjList = this._typeMap.get(type);
        if (!cbObjList || cbObjList.length === 0) return;

        cbObjList.map(o => [type, o.callback, o.target])
            .forEach(o => this.off(o[0], o[1], o[2]));
    }

    offByTarget (target) {
        const cbTypeList = this._targetMap.get(target);
        if (!cbTypeList || cbTypeList.length === 0) return;

        cbTypeList.map(o => [o.type, o.callback, target])
            .forEach(o => this.off(o[0], o[1], o[2]));
    }

    dispatch (type, ...args) {
        const cbObjList = this._typeMap.get(type);
        if (!cbObjList || cbObjList.length === 0) return;

        const removeList = [];
        for (const {callback, target} of cbObjList) {
            if (!cc.isValid(target)) {
                removeList.push([type, callback, target]);
                continue;
            }
            callback.call(target, type, ...args);
        }
        removeList.forEach(o => this.off(o[0], o[1], o[2]));
    }

    clear () {
        this._callbackSet.clear();
        this._typeMap.clear();
        this._targetMap.clear();
    }
}

const singleton = new ComponentEventDispatcher();
module.exports = singleton;
