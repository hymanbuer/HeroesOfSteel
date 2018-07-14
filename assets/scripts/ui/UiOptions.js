
const numSwitches = 7;
const switchConfigs = new Array(numSwitches);
switchConfigs[0] = {name: 'enemy_speed', off: 'High Speed Enemy Turn', on: 'Standard Speed Enemy Turn'};
switchConfigs[1] = {name: 'movement_rate', off: 'Fast Movement Rate', on: 'Slow Movement Rate'};
switchConfigs[2] = {name: 'auto_glom', off: 'No Auto-Glom', on: 'Auto-Glom when Possible'};
switchConfigs[3] = {name: 'auto_center', off: 'No Auto-Center on Heroes', on: 'Auto-Center on Heroes'};
switchConfigs[4] = {name: 'music_switcher', off: 'Music Mute', on: 'Music On'};
switchConfigs[5] = {name: 'sound_switcher', off: 'SFX Mute', on: 'SFX On'};
switchConfigs[6] = {name: 'blood_splatter', off: 'Blood Splatter Off', on: 'Blood Splatter On'};

cc.Class({
    extends: cc.Component,

    properties: {
        switchLabels: [cc.Label],
        musicVolumeLabel: cc.Label,
        soundVolumeLabel: cc.Label,
    },

    start () {
        cc.assert(this.switchLabels.length === numSwitches);
        this.switchStates = new Array(numSwitches).fill(true);
        this.musicVolume = 100;
        this.soundVolume = 100;
    },

    onClickSwitcher (_, switchName) {
        const index = switchConfigs.findIndex(config => config.name === switchName);
        cc.assert(index !== -1, 'wrong switch name -> ' + switchName);
        this._toggleSwitch(index);
    },

    onClickChangeVolume (_, type) {
        switch (type) {
            case 'music_add': this._changeMusicVolume(10); break;
            case 'music_minus': this._changeMusicVolume(-10); break;
            case 'sound_add': this._changeSoundVolume(10); break;
            case 'sound_minus': this._changeSoundVolume(-10); break;
        }
    },

    onClickSave () {
        this.node.destroy();
    },

    _toggleSwitch (index) {
        const state = this.switchStates[index] = !this.switchStates[index];
        const config = switchConfigs[index];
        const text = state ? config.on : config.off;
        this.switchLabels[index].string = text;
    },

    _changeMusicVolume (step) {
        const volume = cc.clampf(this.musicVolume + step, 10, 100);
        if (volume === this.musicVolume) return;

        this.musicVolume = volume;
        this.musicVolumeLabel.string = `${volume}% Volume`;
    },

    _changeSoundVolume (step) {
        const volume = cc.clampf(this.soundVolume + step, 10, 100);
        if (volume === this.soundVolume) return;

        this.soundVolume = volume;
        this.soundVolumeLabel.string = `${volume}% Volume`;
    },
});
