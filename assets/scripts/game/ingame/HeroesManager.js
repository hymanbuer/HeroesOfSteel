
const GlomState = cc.Enum({
    Glom: -1,
    Unglom: -1,
});

class HeroesManager {
    constructor () {
        this._heroes = [];
        this._current = 0;
        this._glomState = GlomState.Unglom;
    }

    addHero (hero) {
        this._heroes.push(hero);
    }

    getSelectedHero () {
        return this._heroes[this._current];
    }

    selectNextHero () {
        this._current = (this._current + 1) % this._heroes.length;
        this.selectHero(this._current);
        return this._heroes[this._current];
    }

    selectHero (index) {
        cc.assert(index <= this._heroes.length, 'invalid index');
        this._current = index;
        return this._heroes[this._current];
    }

    glomHeroes () {
        if (this._glomState === GlomState.Unglom) {
            this._glomState = GlomState.Glom;
            // todo glom
        }
    }

    unglomHeroes () {
        if (this._glomState === GlomState.Glom) {
            this._glomState = GlomState.Unglom;
            // todo unglom
        }
    }

    getGlomState () {
        return this._glomState;
    }
}

HeroesManager.GlomState = GlomState;
module.exports = HeroesManager;