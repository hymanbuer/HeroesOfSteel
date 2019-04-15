
const CharacterControl = require('CharacterControl')

const EIGHT_DIRECTIONS = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
];

function createSprite(spriteFrame) {
    const node = new cc.Node();
    const sprite = node.addComponent(cc.Sprite);
    sprite.trim = cc.Sprite.Type.SIMPLE;
    sprite.sizeMode = cc.Sprite.SizeMode.RAW;
    sprite.spriteFrame = spriteFrame;
    return node;
}

function isSameGrid(a, b) {
    return a.x === b.x && a.y === b.y;
}

function getMinRotationBy (start, target, originRotation = 0) {
    const direction = target.sub(start);
    const radians = Math.atan2(direction.y, direction.x);
    let degrees = -cc.misc.radiansToDegrees(radians);
    
    let differ = degrees - originRotation;
    differ %= 360;
    if (differ > 180) differ -= 360;
    if (differ < -180) differ += 360;

    return differ;
}

// Firebolt
// Spell Attack at 6 Range
// Uses 2 AP and 4 Spirit
// 12 - 18 Fire Dmg, +4 Accuracy

const talent = {
    id: 1,
    name: 'Firebolt',
    level: 1,
    requireLevel: 1,
    requireEquip: 'Null',
    range: 6,
    cost: {AP: 2, SP: 4},
    area: 'Single',

    effects: [
        {
            type: 'SpellAttack',
            targetType: 'Opponent',
            turns: 0,
            attributes: [
                {
                    type: 'Damage',
                    subType: 'Fire',
                    min: 12,
                    max: 18,
                    num: 0,
                }
            ],
        }
    ],
};

cc.Class({
    extends: cc.Component,

    properties: {
        hero: CharacterControl,
        map: cc.Node,
        canvas: cc.Node,

        highlightOpponent: cc.SpriteFrame,
        highlightCompanion: cc.SpriteFrame,
        highlightBlue: cc.SpriteFrame,
        highlightGold: cc.SpriteFrame,
        spriteAtlas: cc.SpriteAtlas,

        explosionParticles: {
            type: cc.ParticleAsset,
            default: null,
        },

        font: cc.Font,
        number: cc.Prefab,
    },

    onLoad () {
        this.mapWidth = 15;
        this.mapHeight = 10;
        this.tileWidth = 64;
        this.tileHeight = 64;
        
        this.tiles = this.map.children;
        this.getTile = (x, y) => {
            const index = y*this.mapWidth + x;
            return this.tiles[index];
        };
        this.getPositionAt = (x, y) => {
            const tile = this.getTile(x, y);
            return cc.v2(tile.x, tile.y);
        };

        for (let y = 0; y < this.mapHeight; ++y) {
            for (let x = 0; x < this.mapWidth; ++x) {
                const tile = this.getTile(x, y);
                tile.grid = cc.v2(x, y);
            }
        }

        this.bfs = this._createSearchMethod();

        //-----------------------

        // 4, 1
        this.heroGrid = cc.v2(4, 1);
        this.hero.stand();
        this.hero.node.parent = this.getTile(this.heroGrid.x, this.heroGrid.y);

        // 2, 4
        // 5, 4
        this.targetGrid = cc.v2(5, 4);

        this.talent = talent;
    },

    start () {
        const execTalent = ()=> {
            this.showTargets();

            this.scheduleOnce(()=> {
                this.showSeletedTarget();

                this.castSpell();
                this.scheduleOnce(()=> {
                    this.fireToTarget().then(()=> {
                        this.explosion();
                        this.scheduleOnce(()=> {
                            this.showDamageNumber(-23);
                        }, 0.25);
                    });
                }, 0.5);

                this.scheduleOnce(()=> {
                    this.clearHighlights();
                }, 1.0);
            }, 3.0);
        };

        this.schedule(execTalent, 5);
        execTalent();
    },

    showDamageNumber (num) {
        const targetPosition = this.getPositionAt(this.seletedGrid.x, this.seletedGrid.y);
        targetPosition.x += -10;
        targetPosition.y += 28;

        const number = cc.instantiate(this.number);
        const label = number.getComponent(cc.Label)
        label.string = num.toString();
        number.position = targetPosition;
        this.canvas.addChild(number);

        number.opacity = 0;
        number.runAction(cc.sequence(cc.fadeIn(0.25), 
            cc.delayTime(0.5), cc.fadeOut(0.25), cc.removeSelf()));
    },

    explosion () {
        const targetPosition = this.getPositionAt(this.seletedGrid.x, this.seletedGrid.y);
        
        const node = new cc.Node();
        const particleSystem = node.addComponent(cc.ParticleSystem);
        particleSystem.file = this.explosionParticles;
        particleSystem.autoRemoveOnFinish = true;
        node.position = targetPosition;
        node.scale = 0.5;
        this.canvas.addChild(node);
    },

    fireToTarget () {
        return new Promise(resolve => {
            const fireFrame = this.spriteAtlas.getSpriteFrame('tile_flame_attack');
            const fire = createSprite(fireFrame);
            let bonePos = this.hero.getBonePosition('Spell Ball');
            bonePos = this.canvas.convertToNodeSpaceAR(bonePos);
            fire.position = bonePos;
            this.canvas.addChild(fire);

            fire.scale = 0;
            const targetPosition = this.getPositionAt(this.seletedGrid.x, this.seletedGrid.y);
            const distance = targetPosition.sub(fire.position).mag();
            const move = cc.moveTo(distance/480, targetPosition);
            const scale = cc.scaleTo(0.1, 0.6, 0.6);
            fire.runAction(cc.sequence(scale, move, cc.callFunc(()=> {
                resolve();
                fire.destroy();
            })));

            const rotation = getMinRotationBy(fire.position, targetPosition);
            fire.rotation = rotation
        });
    },

    castSpell () {
        this.hero.play('Cast Spell');
    },

    showTargets () {
        const grids = this.bfs(this.heroGrid, this.talent.range);
        grids.shift();

        this.highlights = [];
        for (const grid of grids) {
            const tile = this.getTile(grid.x, grid.y);
            // if (tile.childrenCount === 0) continue;

            const sprite = createSprite(this.highlightOpponent);
            sprite.zIndex = -1;
            sprite.scale = 0.95;
            sprite.opacity = 128;
            tile.addChild(sprite);
            this.highlights.push(sprite);
        }
    },

    showSeletedTarget () {
        this.seletedGrid = cc.v2(5, 4);

        for (let i = this.highlights.length - 1; i >= 0; --i) {
            const highlight = this.highlights[i];
            if (!isSameGrid(highlight.parent.grid, this.seletedGrid)) {
                highlight.destroy();
                this.highlights.splice(i, 1);
            } else {
                highlight.opacity = 255;
            }
        }
    },

    clearHighlights () {
        this.highlights.forEach(h => h.destroy());
        this.highlights = [];
    },

    _createSearchMethod () {
        const getNeighbors = next => {
            const grids = [];
            for (const offset of EIGHT_DIRECTIONS) {
                const x = next.x + offset[0];
                const y = next.y + offset[1];
                if (this._isValidGridXY(x, y))
                    grids.push({x, y});
            }
            return grids;
        };

        const visited = [];
        for (let y = 0; y <= this.mapHeight; ++y)
            visited[y] = new Array(this.mapWidth).fill(false);

        return (startGrid, distance) => {
            const grids = [];
            const queue = [];
            const dirty = [];
            queue.push(startGrid);
            visited[startGrid.y][startGrid.x] = true;
            startGrid.distance = 0;
            while (queue.length > 0) {
                const next = queue.shift();
                grids.push(next);
                dirty.push(next);
                if (next.distance >= distance) continue;

                for (const neighbor of getNeighbors(next)) {
                    if (!visited[neighbor.y][neighbor.x]) {
                        visited[neighbor.y][neighbor.x] = true;
                        neighbor.distance = next.distance + 1;
                        queue.push(neighbor);
                    }
                }
            }

            dirty.forEach(grid => visited[grid.y][grid.x] = false);

            return grids;
        };
    },

    _isValidGridXY (x, y) {
        return x >= 0 && x < this.mapWidth
            && y >= 0 && y < this.mapHeight;
    },
});
 