
const LocalStorage = require('LocalStorage');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    start () {
        const items = [
            {key: 'number', value: 24},
            {key: 'string', value: 'test'},
            {key: 'boolean', value: 'true'},
            {key: 'object', value: {a: 3, b: 'xx'}},
            {key: 'null', value: null},
        ];

        for (const item of items) {
            LocalStorage.setItem(item.key, item.value);
        }

        for (const item of items) {
            const value = LocalStorage.getItem(item.key);
            cc.log(value, value === item.value);
        }

        LocalStorage.removeItem(items[0].key);
        cc.log(LocalStorage.getItem(items[0].key));
    },

    
});
