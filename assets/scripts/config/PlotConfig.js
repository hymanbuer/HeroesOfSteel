
const exports = module.exports = {};

const UUID = require('UUID');

const talkList = [
    {
        portrait: '89d9db05-84ae-439b-a471-161852fa0c6d',
        font: 0,
        text: 'Hello Wolrd',
    },
    {
        portrait: '89d9db05-84ae-439b-a471-161852fa0c6d',
        font: 1,
        text: 'Hello Wolrd 2222222222',
    },
    {
        portrait: '89d9db05-84ae-439b-a471-161852fa0c6d',
        font: 0,
        text: 'Hello Wolrd 33333333333',
    },
];

// exports.startPlot = [
//     { cmd: 'SYS_DELAY_TIME', delay: 2 },

//     { cmd: 'CAM_MOVE_ON', grid: {x: 17, y: 61} },

//     { cmd: 'SYS_DELAY_TIME', delay: 2 },

//     { cmd: 'MAP_REPLACE_TILE', grid: {x: 13, y: 59}, id: 245, layerName: 'Background' },

//     { cmd: 'SYS_DELAY_TIME', delay: 2 },

//     { cmd: 'MAP_REPLACE_TILE', grid: {x: 13, y: 59}, id: 246, layerName: 'Background' }
// ];

// exports.startPlot = {
//     cmd: 'CHAR_ADD',
//     uuid: '43f0f278-c2c3-4a70-b81a-65f75fc3d72b',
//     name: 'Thief',
//     tag: 101,
//     grid: {x: 9, y: 61}
// };


// exports.startPlot = [
//     { cmd: 'SYS_DELAY_TIME', delay: 1 },
//     { cmd: 'SYS_SHOW_DIALOG', dialog: talkList},

//     {
//         cmd: 'CHAR_ADD',
//         uuid: '43f0f278-c2c3-4a70-b81a-65f75fc3d72b',
//         name: 'Thief',
//         tag: 101,
//         grid: {x: 9, y: 61}
//     },

//     { cmd: 'SYS_DELAY_TIME', delay: 1 },

//     { cmd: 'CAM_MOVE_ON', grid: {x: 9, y: 61} },

//     { cmd: 'SYS_DELAY_TIME', delay: 1 },

//     { cmd: 'CHAR_FACE_TO', tag: 101, grid: {x: 9, y: 59} },

//     { cmd: 'SYS_DELAY_TIME', delay: 1 },

//     { cmd: 'CHAR_FOLLOW_PATH', tag: 101, path: [
//         {x: 9, y: 60},
//         {x: 8, y: 60},
//         {x: 7, y: 60},
//         {x: 7, y: 61},
//         {x: 8, y: 61},
//         {x: 9, y: 61},
//         {x: 10, y: 61},
//     ]},

// ];


function cam_place_on(x, y) {
    return { cmd: 'CAM_PLACE_ON', grid: {x, y} };
}

function char_add(uuid, name, tag, x, y, rotation) {
    return {
        cmd: 'CHAR_ADD',
        uuid,
        name,
        tag,
        grid: {x, y},
        rotation,
    };
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

exports.startPlot = 
[
    cam_place_on(12, 64),
    char_add(UUID.Skeleton_Outlander, 'Outlander', 101, 12, 64, 90),
    char_add(UUID.Skeleton_Thief, 'Thief', 104, 7, 64, 90),

    char_follow_path(101, [13, 65, 13, 66]),
    sys_delay_time(0.5),
    char_follow_path(101, [12, 65]),
    sys_delay_time(0.5),
    char_follow_path(101, [13, 64]),

    [
        sys_delay_time(0.5),
        char_face_to(104, 8, 63),
    ],
    


    sys_delay_time(99999),
];