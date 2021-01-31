export function getXRotationMatrix(angle) {
    return math.matrix([
        [1,  0,               0              ],
        [0,  math.cos(angle), math.sin(angle)],
        [0, -math.sin(angle), math.cos(angle)]
    ]);
}

export function getYRotationMatrix(angle) {
    return math.matrix([
        [math.cos(angle), 0, -math.sin(angle)],
        [0,               1,  0              ],
        [math.sin(angle), 0,  math.cos(angle)]
    ]);
}