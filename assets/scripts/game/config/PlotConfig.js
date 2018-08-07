
const exports = module.exports = {};

const UUID = require('UUID');
const Skeleton = UUID.Skeleton;
const DialogPortrait = UUID.DialogPortrait;

const Dialogs = [];
Dialogs[0] = [
    {
        portrait: DialogPortrait.Thief,
        font: 0,
        text: 'Hear that?',
    },
    {
        portrait: DialogPortrait.Wizard,
        font: 0,
        text: 'Someone is coming!',
    },
    {
        portrait: DialogPortrait.Wizard,
        font: 0,
        text: 'You there, guard! I demand my audience with the Baron Arhaive, '
            + 'or with his Magus.',
    },
    {
        portrait: DialogPortrait.Wizard,
        font: 0,
        text: 'I will not tolerate-',
    },
    {
        portrait: DialogPortrait.ArhaiveSoldier_2,
        font: 0,
        text: 'Enough gab. Stay back from the bars, ya scum.',
    },
];

Dialogs[1] = [
    {
        portrait: DialogPortrait.ArhaiveSoldier_2,
        font: 0,
        text: 'Move it, Cleric.',
    },
    {
        portrait: DialogPortrait.Cleric,
        font: 0,
        text: 'I am a holy Cleric of the All-Father. I demand an explanation for this!',
    },
    {
        portrait: DialogPortrait.Cleric,
        font: 0,
        text: 'Why am I being jailed?',
    },
    {
        portrait: DialogPortrait.ArhaiveSoldier_1,
        font: 0,
        text: 'None of my business, whatever yer crime. Now, move along!',
    },
    {
        portrait: DialogPortrait.Cleric,
        font: 0,
        text: 'Crime! I have-',
    },
    {
        portrait: DialogPortrait.ArhaiveSoldier_1,
        font: 0,
        text: 'Move along!',
    },
];

Dialogs[2] = [
    {
        portrait: DialogPortrait.ArhaiveSoldier_1,
        font: 0,
        text: 'In you go!',
    },
    {
        portrait: DialogPortrait.Cleric,
        font: 0,
        text: 'I am passing through Red Hill on a pilgrimage! Why am I being locked in irons?',
    },
    {
        portrait: DialogPortrait.Wizard,
        font: 0,
        text: `Don't let them put you in that cell! I've been locked in here for two days.`,
    },
    {
        portrait: DialogPortrait.Wizard,
        font: 0,
        text: `I demand my audience!`,
    },
    {
        portrait: DialogPortrait.ArhaiveSoldier_1,
        font: 0,
        text: 'Noisy prisoner in the hood - shut your trap or I will shut it for you.',
    },
    {
        portrait: DialogPortrait.Outlander,
        font: 0,
        text: `Don't waste your strength, Cleric. They're well-armed.`,
    },
];

Dialogs[3] = [
    {
        portrait: DialogPortrait.ArhaiveSoldier_2,
        font: 0,
        text: 'There you go. Welcome to your new home for a little while.',
    },
    {
        portrait: DialogPortrait.Cleric,
        font: 0,
        text: 'I would like to speak with the Magus now.',
    },
    {
        portrait: DialogPortrait.ArhaiveSoldier_1,
        font: 0,
        text: `Heh, sure you'd like that. But that's a long walk. We just brought you down here.`,
    },
    {
        portrait: DialogPortrait.ArhaiveSoldier_1,
        font: 0,
        text: `Why don't you sit tight?`,
    },
];

Dialogs[4] = [
    {
        portrait: DialogPortrait.ArhaiveSoldier_1,
        font: 0,
        text: `And you. Shut yer scraggly beard. Make any more noise and you'll regret it.`,
    },
    {
        portrait: DialogPortrait.Wizard,
        font: 0,
        text: 'Humph.',
    },
];

Dialogs[5] = [
    {
        portrait: DialogPortrait.Wizard,
        font: 0,
        text: `Well, they're gone. We've got to find a way out of these blasted cells!`,
    },
    {
        portrait: DialogPortrait.Thief,
        font: 0,
        text: 'Welcome to the dungeons of Baron Arhive, Cleric.',
    },
    {
        portrait: DialogPortrait.Cleric,
        font: 0,
        text: 'I am not a criminal; I do not understand why I have been jailed!',
    },
    {
        portrait: DialogPortrait.Thief,
        font: 0,
        text: `None of us are criminals. I'm Tamilin, whats your name?`,
    },
    {
        portrait: DialogPortrait.Cleric,
        font: 0,
        text: 'I am Kyera.',
    },
    {
        portrait: DialogPortrait.Wizard,
        font: 0,
        text: `We should look around our cells and see if there is anything we can use to escape.`,
    },
    {
        portrait: DialogPortrait.Wizard,
        font: 1,
        text: 'Click on any of us to switch to that character or use the Golden Arrow icon.',
    },
    {
        portrait: DialogPortrait.Wizard,
        font: 1,
        text: 'To move, click on the destination square. Clicking while a character '
            + 'is moving will trigger a new move.',
    },
];


function cam_place_on(x, y) {
    return { cmd: 'CAM_PLACE_ON', grid: {x, y} };
}

function cam_move_on(x, y) {
    return { cmd: 'CAM_MOVE_ON', grid: {x, y} };
}

function char_add(uuid, defaultSkin, name, tag, x, y, rotation, fadeIn, disableFogEffect) {
    return {
        cmd: 'CHAR_ADD',
        uuid,
        defaultSkin,
        name,
        tag,
        grid: {x, y},
        rotation,
        fadeIn,
        disableFogEffect,
    };
}

function char_remove(tag) {
    return { cmd: 'CHAR_REMOVE', tag: tag };
}

function char_follow_path(tag, path) {
    const list = [];
    for (let i = 0; i < path.length; i += 2) {
        const x = path[i], y = path[i + 1];
        list.push({x, y});
    }
    return { cmd: 'CHAR_FOLLOW_PATH', tag: tag, path: list};
}

function char_face_to(tag, x, y) {
    return { cmd: 'CHAR_FACE_TO', tag: tag, grid: {x, y} };
}

function sys_delay_time(delay) {
    return { cmd: 'SYS_DELAY_TIME', delay: delay };
}

function sys_show_dialog(talkList) {
    return { cmd: 'SYS_SHOW_DIALOG', dialog: talkList};
}

function map_replace_tile(x, y, id, layerName) {
    return { cmd: 'MAP_REPLACE_TILE', 
        grid: {x: x, y: y}, id: id, layerName: layerName };
}

exports.startPlot = 
[
    cam_place_on(12, 64),

    [
        char_add(Skeleton.Outlander, 'Unarmed', 'Outlander', 101, 12, 64, 90),
        char_add(Skeleton.Wizard, 'Unarmed', 'Wizard', 102, 8, 58, 90),
        char_add(Skeleton.Thief, 'Unarmed', 'Thief', 104, 7, 64, 90),
    ],
// /*    
    char_follow_path(101, [13, 65, 13, 66]),
    sys_delay_time(0.5),
    char_follow_path(101, [12, 65]),
    sys_delay_time(0.5),
    char_follow_path(101, [13, 64]),

    [
        sys_delay_time(0.5),
        char_face_to(104, 8, 63),
        char_face_to(102, 9, 59),
        cam_move_on(13, 64),
    ],

    [
        char_add(Skeleton.Cleric, 'Unarmed', 'Cleric', 103, 20, 61, 180, true),
        char_add(Skeleton.MonsterHuman, 'Baron Soldier', '', 201, 19, 61, 180, true),
        char_add(Skeleton.MonsterHuman, 'Baron Soldier', '', 202, 21, 61, 180, true),
    ],
    
    sys_delay_time(0.5),
    cam_move_on(9, 61),
    sys_delay_time(0.5),
    sys_show_dialog(Dialogs[0]),
    sys_delay_time(0.2),
    cam_move_on(20, 61),
    sys_delay_time(0.2),
    sys_show_dialog(Dialogs[1]),
    sys_delay_time(0.2),

    [
        char_follow_path(201, [18, 61, 17, 60, 16, 60, 15, 60, 14, 60, 13, 60]),
        cam_move_on(19, 61),
    ],
    char_face_to(201, 13, 59),
    map_replace_tile(13, 59, 245, 'Background'),

    [
        char_follow_path(103, [19, 61, 18, 61, 17, 61, 16, 61, 15, 61, 14, 61]),
        char_follow_path(202, [20, 61, 19, 61, 18, 61, 17, 61, 16, 61, 15, 61]),
        cam_move_on(13, 61),
    ],

    sys_delay_time(0.2),
    sys_show_dialog(Dialogs[2]),
    sys_delay_time(0.2),

    [
        char_follow_path(103, [14, 60, 13, 59, 13, 58]),
        cam_move_on(13, 58),
        char_face_to(101, 13, 63),
    ],
    map_replace_tile(13, 59, 246, 'Background'),
    char_face_to(103, 13, 59),

    sys_delay_time(0.2),
    sys_show_dialog(Dialogs[3]),
    sys_delay_time(0.2),

    [
        char_follow_path(201, [12, 61, 11, 61, 10, 61, 9, 60]),
        cam_move_on(11, 61),
    ],

    sys_delay_time(0.2),
    sys_show_dialog(Dialogs[4]),
    sys_delay_time(0.2),

    [
        char_follow_path(201, [10, 61, 11, 61, 12, 61, 13, 61, 14, 61, 15, 61,
            16, 61, 17, 61, 18, 61, 19, 61, 20, 61, 21, 61, 22, 61]),
        char_follow_path(202, [16, 61, 17, 61, 18, 61, 19, 61, 20, 61, 21, 61, 22, 61]),
    ],
    char_remove(201),
    char_remove(202),

    sys_delay_time(0.2),
    sys_show_dialog(Dialogs[5]),
    sys_delay_time(0.2),
// */
];