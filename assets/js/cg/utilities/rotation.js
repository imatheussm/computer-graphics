export function getXRotationMatrix(angle) {
    return math.matrix([
        [1,  0,               0              , 0],
        [0,  math.cos(angle), math.sin(angle), 0],
        [0, -math.sin(angle), math.cos(angle), 0],
        [0,  0,               0,               1],
    ]);
}

export function getYRotationMatrix(angle) {
    return math.matrix([
        [math.cos(angle), 0, -math.sin(angle), 0],
        [0,               1,  0,               0],
        [math.sin(angle), 0,  math.cos(angle), 0],
        [0,               0,  0,               1]
    ]);
}