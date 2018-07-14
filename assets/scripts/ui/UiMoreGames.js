
const ItemGame = require('ItemGame');

const itemInfos = [];

// Templar Battleforce
itemInfos.push({})
itemInfos[0].icon = 'store/game_icon_tb';
itemInfos[0].title = 'Templar Battleforce';
itemInfos[0].content = 'Step into the pilot suit of a Leviathan mech and lead\
 the Templar Knights in battle against fierce enemies. Create your own unique\
 Battleforce by recruiting an array of Templar specialists and then design\
 their exact build of equipment and talents...';
itemInfos[0].url = 'http://www.templarbattleforce.com/';

// Heroes of Steel
itemInfos.push({})
itemInfos[1].icon = 'store/game_icon_hos';
itemInfos[1].title = 'Heroes of Steel';
itemInfos[1].content = 'It is the dawn of the Seventy First Year after the world has fallen.\
 Four of the Thirteen Gods rose up against their creator, the All-Father,\
 and destroyed him in a cataclysmic event. In the following years of darkness and ruin,\
 the kingdoms of man fell in war and flame...';
itemInfos[1].url = 'http://www.tresebrothers.com/heroes-of-steel/';

// Star Traders 4X Empires
itemInfos.push({})
itemInfos[2].icon = 'store/game_icon_st4x';
itemInfos[2].title = 'Star Traders 4X Empires';
itemInfos[2].content = 'Star Traders 4X allows you to take the reigns\
 of the new empires as the Exodus ends. Play Star Traders to see the story\
 from the other side - as a individual Captain in a newly settled Quadrant...';
itemInfos[2].url = 'http://www.tresebrothers.com/star-traders-4x-empires/';

// Star Traders
itemInfos.push({})
itemInfos[3].icon = 'store/game_icon_st';
itemInfos[3].title = 'Star Traders';
itemInfos[3].content = 'Explore, exploit, and travel across the sprawling Elite Quadrant.\
 Reach the Quadrant Core with the mightiest planets...';
itemInfos[3].url = 'http://www.tresebrothers.com/upgrade-star-traders';

// Templar Assault
itemInfos.push({})
itemInfos[4].icon = 'store/game_icon_ta';
itemInfos[4].title = 'Templar Assault';
itemInfos[4].content = 'Templar Assault is a space combat simulator by Trese Brothers Software.\
 In the game, you control a squad of Templar Warriors equipped with Leviathan Battle Suits.\
 Send your squad across the galaxy in an epic war again the Alien...';
itemInfos[4].url = 'http://www.corytrese.com/games/templars/';

// Cyber Knights
itemInfos.push({})
itemInfos[5].icon = 'store/game_icon_ck';
itemInfos[5].title = 'Cyber Knights';
itemInfos[5].content = 'Welcome to the New Boston Zone, the last surviving city on the east coast.\
 The year is 2217 and the world has ended.\
 Mega-corporations provide humanity\'s last survivors shelter in vast dome cities,\
 such as New Boston, New Berlin and New Tokyo...';
itemInfos[5].url = 'http://www.tresebrothers.com/cyber-knights/';

// Age of Pirates
itemInfos.push({})
itemInfos[6].icon = 'store/game_icon_ap';
itemInfos[6].title = 'Age of Pirates';
itemInfos[6].content = 'Embark on a swashbuckling journey on the high seas in this challenging.\
 Explore, travel and trade across the giant Elite world, four times the size of the free world...';
itemInfos[6].url = 'http://www.tresebrothers.com/sail-the-seas-in-age-of-pirates/';

cc.Class({
    extends: cc.Component,

    properties: {
        gameItemPrefab: cc.Prefab,
        container: cc.Node,
    },

    start () {
        for (const info of itemInfos) {
            const item = cc.instantiate(this.gameItemPrefab);
            item.getComponent(ItemGame).init(info);
            this.container.addChild(item);
        }
    },

    onClickBack () {
        this.node.destroy();
    },
});
