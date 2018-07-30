
const Timeline = module.exports = {};

/**
 * Wrap async functions that return a promise.
 * Because cocos creator's normal script not support generator,
 * so I write this helper function in here.
 * 
 * author: Jinfeng Li
 * 
 * @param {Function Array} fns 
 */
Timeline.create = function (fns) {
    return function () {
        return new Promise(function (resolve, reject) {
            if (!(fns instanceof Array))
                fns = fns ? [fns] : [];

            const exec = next => {
                if (next >= fns.length) {
                    resolve();
                    return;
                }

                let fn = fns[next];
                if (fn instanceof Array) {
                    const arr = fn;
                    fn = ()=> new Promise((ok, err) => {
                        let count = 0;
                        for (const f of arr) {
                            f().then(()=> {
                                count += 1;
                                if (count >= arr.length)
                                    ok();
                            }, err);
                        }
                    });
                }

                fn().then(()=> exec(next + 1), reject);
            };

            exec(0);
        });
    };
}