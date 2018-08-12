
const GameSetting = require('GameSetting');
const GameConfig = require('GameConfig');
const LocalStorage = require('LocalStorage');

const numSwitches = 7;
const switchConfigs = new Array(numSwitches);
switchConfigs[0] = {name: 'enemy_speed', off: 'High Speed Enemy Turn', on: 'Standard Speed Enemy Turn'};
switchConfigs[1] = {name: 'movement_rate', off: 'Fast Movement Rate', on: 'Slow Movement Rate'};
switchConfigs[2] = {name: 'auto_glom', off: 'No Auto-Glom', on: 'Auto-Glom when Possible'};
switchConfigs[3] = {name: 'auto_center', off: 'No Auto-Center on Heroes', on: 'Auto-Center on Heroes'};
switchConfigs[4] = {name: 'music_switcher', off: 'Music Mute', on: 'Music On'};
switchConfigs[5] = {name: 'sound_switcher', off: 'SFX Mute', on: 'SFX On'};
switchConfigs[6] = {name: 'blood_splatter', off: 'Blood Splatter Off', on: 'Blood Splatter On'};

function setState(index, on) {
    on = !!on;
    switch (index) {
        case 0: GameSetting.enemySpeed = on ? GameConfig.StandardEnemySpeed : GameConfig.HighEnemySpeed; break;
        case 1: GameSetting.playerSpeed = on ? GameConfig.StandardPlayerSpeed : GameConfig.HighPlayerSpeed; break;
        case 2: GameSetting.isAutoGlom = on; break;
        case 3: GameSetting.isAutoFocus = on; break;
        case 4: GameSetting.isMusicOn = on; break;
        case 5: GameSetting.isSoundOn = on; break;
        case 6: GameSetting.isBloodSplatterOn = on; break;
    }
}

function getState(index) {
    switch (index) {
        case 0: return GameSetting.enemySpeed === GameConfig.StandardEnemySpeed;
        case 1: return GameSetting.playerSpeed === GameConfig.StandardPlayerSpeed;
        case 2: return GameSetting.isAutoGlom;
        case 3: return GameSetting.isAutoFocus;
        case 4: return GameSetting.isMusicOn;
        case 5: return GameSetting.isSoundOn;
        case 6: return GameSetting.isBloodSplatterOn;
    }
    return false;
}

cc.Class({
    extends: cc.Component,

    properties: {
        switchLabels: [cc.Label],
        musicVolumeLabel: cc.Label,
        soundVolumeLabel: cc.Label,
    },

    start () {
        cc.assert(this.switchLabels.length === numSwitches);
        for (let i = 0; i < numSwitches; ++i) {
            this._updateState(i, getState(i));
        }
        this.musicVolumeLabel.string = `${GameSetting.musicVolume}% Volume`;
        this.soundVolumeLabel.string = `${GameSetting.soundVolume}% Volume`;
    },

    onClickSwitcher (_, switchName) {
        const index = switchConfigs.findIndex(config => config.name === switchName);
        cc.assert(index >= 0, 'wrong switch name -> ' + switchName);
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
        LocalStorage.setItem('GameSetting', GameSetting);
        this.node.destroy();
    },

    _toggleSwitch (index) {
        const state = !getState(index);
        setState(index, state);
        this._updateState(index, state);
    },

    _updateState (index, state) {
        const config = switchConfigs[index];
        this.switchLabels[index].string = state ? config.on : config.off;
    },

    _changeMusicVolume (step) {
        const volume = cc.misc.clampf(GameSetting.musicVolume + step, 10, 100);
        if (volume === GameSetting.musicVolume) return;

        GameSetting.musicVolume = volume;
        this.musicVolumeLabel.string = `${volume}% Volume`;
    },

    _changeSoundVolume (step) {
        const volume = cc.misc.clampf(GameSetting.soundVolume + step, 10, 100);
        if (volume === GameSetting.soundVolume) return;

        GameSetting.soundVolume = volume;
        this.soundVolumeLabel.string = `${volume}% Volume`;
    },
});
