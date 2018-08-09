
const AffectAreaPolicy = require('AffectAreaPolicy');

class Talent {
    constructor (owner) {
        this.owner = owner;
        this.range = 1;
        this.affectAreaPolicy = AffectAreaPolicy.singleTarget;
        this.affectTargets = [];
    }

    
}

module.exports = Talent;