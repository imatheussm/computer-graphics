import * as rotation from "../../utilities/rotation.js";

const ALPHA = math.unit(35.264, "deg"), BETA = math.unit(45, "deg");
const X_ROTATION_MATRIX = rotation.getXRotationMatrix(ALPHA), Y_ROTATION_MATRIX = rotation.getYRotationMatrix(BETA);
export const ROTATION_MATRIX = math.multiply(X_ROTATION_MATRIX, Y_ROTATION_MATRIX);
