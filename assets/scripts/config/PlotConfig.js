
const exports = module.exports = {};

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


exports.startPlot = [
    // { cmd: 'SYS_DELAY_TIME', delay: 2 },
    { cmd: 'SYS_SHOW_DIALOG', dialog: talkList},

    // {
    //         cmd: 'CHAR_ADD',
    //         uuid: '43f0f278-c2c3-4a70-b81a-65f75fc3d72b',
    //         name: 'Thief',
    //         tag: 101,
    //         grid: {x: 9, y: 61}
    //     }
];