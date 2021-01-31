import * as Isometric from "../../projection/types/Orthographic.js";

const FOCAL_DISTANCE = 100;
export const ROTATION_MATRIX = math.multiply(Isometric.ROTATION_MATRIX, math.matrix([
    [FOCAL_DISTANCE, 0,              0,              0             ],
    [0,              FOCAL_DISTANCE, 0,              0             ],
    [0,              0,              0,              0             ],
    [1,              1,              1,              FOCAL_DISTANCE]
]));
