
const exports = module.exports = {};

exports.createHero = function (skeletonData, defaultSkin, animation) {
    const innerNode = new cc.Node();
    const skeleton = innerNode.addComponent(sp.Skeleton);
    skeleton.skeletonData = skeletonData;
    skeleton.defaultSkin = defaultSkin;
    skeleton.defaultAnimation = skeleton.animation = animation;
    skeleton.premultipliedAlpha = false;

    const node = new cc.Node();
    innerNode.rotation = -90;
    innerNode.scaleX = innerNode.scaleY = 0.25;
    node.skeleton = skeleton;
    node.addChild(innerNode);

    return node;
}