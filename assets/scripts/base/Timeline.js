
const Timeline = module.exports = {};

/**
 * Wrap async functions that return a promise.
 * Because cocos creator's normal script not support generator,
 * so I write this helper function in here.
 * 
 * author: Jinfeng Li
 * 
 * @param {Function|Array} fns 
 */
Timeline.create = function (fns) {
    return function (args) {
        return new Promise(function (resolve, reject) {
            if (!(fns instanceof Array))
                fns = fns ? [fns] : [];

            const exec = (lastResult, next) => {
                if (next >= fns.length) {
                    resolve(lastResult);
                    return;
                }

                let fn = fns[next];
                if (fn instanceof Array) {
                    const arr = fn;
                    fn = ()=> new Promise((ok, err) => {
                        let count = 0;
                        const results = [];
                        for (const f of arr) {
                            f(lastResult).then(result => {
                                count += 1;
                                results.push(result);
                                if (count >= arr.length)
                                    ok(results);
                            }, err);
                        }
                    });
                }

                fn(lastResult).then(result => exec(result, next + 1), reject);
            };

            exec(args, 0);
        });
    };
}