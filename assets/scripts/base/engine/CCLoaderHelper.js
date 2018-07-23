
const CCLoaderHelper = module.exports = {};

CCLoaderHelper.queryAsset = function (uuid) {
    return new Promise((resolve, reject) => {
        cc.AssetLibrary.queryAssetInfo(uuid, (err, url, raw) => {
            const asset = cc.loader.getRes(url);
            resolve(asset);
        });
    });
}

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
    return new Promise((resolve, reject) => {
        cc.loader.load({ type: 'uuid', uuid: uuid }, null, (err, asset) => {
            if (err)
                reject(err);
            else
                resolve(asset);
        });
    });
}

