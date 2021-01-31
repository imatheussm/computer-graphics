const SIGMA = .5, THETA = math.unit(30, "deg");
export const ROTATION_MATRIX = math.matrix([
    [1, 0, SIGMA * math.cos(THETA), 0],
    [0, 1, SIGMA * math.sin(THETA), 0],
    [0, 0, 0                      , 0],
    [0, 0, 0                      , 1]
])
