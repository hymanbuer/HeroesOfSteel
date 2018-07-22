
const CCLoaderHelper = module.exports = {};

// if the res was already loaded then return directly,
// other then load by cc.loader.loadRes.
CCLoaderHelper.loadResByUrl = function (url, type) {
    const res = cc.loader.getRes(url, type);
    if (res)
        return new Promise((resolve, reject) => resolve(res));
    
    return new Promise((resolve, reject) => {
        cc.loader.loadRes(url, type, (err, asset) => {
            if (err)
                reject(err);
            else
                resolve(asset);
        });
    });
}

CCLoaderHelper.loadResByUuid = function (uuid) {
    const res = cc.AssetLibrary.getAssetByUuid(uuid);
    if (res)
        return new Promise((resolve, reject) => resolve(res));

    return new Promise((resolve, reject) => {
        cc.loader.load({ type: 'uuid', uuid: uuid }, null, (err, asset) => {
            if (err)
                reject(err);
            else
                resolve(asset);
        });
    });
}

