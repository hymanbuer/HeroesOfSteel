
const exports = module.exports = {};

const cross_3x3 = [
    0, 1, 0,
    1, 1, 1,
    0, 1, 0,
];

const matrix_3x3 = [
    1, 1, 1,
    1, 1, 1,
    1, 1, 1,
];

const fog_5x5 = [
    0, 0, 1, 0, 0,
    0, 1, 1, 1, 0,
    1, 1, 1, 1, 1,
    0, 1, 1, 1, 0,
    0, 0, 1, 0, 0,
];

const fog_7x7 = [
    0, 0, 0, 1, 0, 0, 0,
    0, 0, 1, 1, 1, 0, 0,
    0, 1, 1, 1, 1, 1, 0,
    1, 1, 1, 1, 1, 1, 1,
    0, 1, 1, 1, 1, 1, 0,
    0, 0, 1, 1, 1, 0, 0,
    0, 0, 0, 1, 0, 0, 0,
];

function getOffsets(rows, cols, affectArray) {
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);
    const offsets = [];
    for (let i = 0; i < affectArray.length; ++i) {
        if (affectArray[i] === 0) continue;

        const row = Math.floor(i / cols);
        const col = i % cols;
        offsets.push({x: col - centerCol, y: row - centerRow});
    }

    return offsets;
}

const offsets_cross_3x3 = getOffsets(3, 3, cross_3x3);
const offsets_matrix_3x3 = getOffsets(3, 3, matrix_3x3);
const offsets_fog_5x5 = getOffsets(5, 5, fog_5x5);
const offsets_fog_7x7 = getOffsets(7, 7, fog_7x7);

function getArea(offsets, targetGrid) {
    return offsets.map(offset => {
        const x = offset.x + targetGrid.x;
        const y = offset.y + targetGrid.y;
        return {x, y};
    });
}

exports.singleTarget = function (targetGrid) {
    return [targetGrid];
}

exports.crossArea_3x3 = function (targetGrid) {
    return getArea(offsets_cross_3x3, targetGrid);
}

exports.matrixArea_3x3 = function (targetGrid) {
    return getArea(offsets_matrix_3x3, targetGrid);
}

exports.fogArea_5x5 = function (targetGrid) {
    return getArea(offsets_fog_5x5, targetGrid);
}

exports.fogArea_7x7 = function (targetGrid) {
    return getArea(offsets_fog_7x7, targetGrid);
}