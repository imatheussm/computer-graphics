import * as tools from "../tools.js";
import * as constants from "../constants.js";

let center, radius;

export function initializer() {
    constants.CANVAS.off("click").on("click", centerEvent);
    tools.showMessage("Choose a point to define the CENTER of the circle.");
}

function centerEvent(event) {
    center = tools.getCoordinates(event);
    tools.paintSquare(center, constants.BLUE);

    constants.CANVAS.off("click").on("click", radiusEvent);
    tools.showMessage("Choose another point to define the RADIUS of the circle.");
}

function radiusEvent(event) {
    const border = tools.getCoordinates(event);
    const x_dist = Math.pow(center[0] - border[0], 2);
    const y_dist = Math.pow(center[1] - border[1], 2);
    radius = parseInt(Math.sqrt(x_dist + y_dist).toString());

    draw();

    constants.CANVAS.off("click").on("click", centerEvent);
    tools.showMessage("Choose a point to define the CENTER of the circle.");
}

function drawEight(x, y) {
    tools.paintSquare([ x + center[0],  y + center[1]]);
    tools.paintSquare([ y + center[0],  x + center[1]]);
    tools.paintSquare([ y + center[0], -x + center[1]]);
    tools.paintSquare([ x + center[0], -y + center[1]]);
    tools.paintSquare([-x + center[0], -y + center[1]]);
    tools.paintSquare([-y + center[0], -x + center[1]]);
    tools.paintSquare([-y + center[0],  x + center[1]]);
    tools.paintSquare([-x + center[0],  y + center[1]]);
}

function draw() {
    let [x, y] = [radius, 0];
    let error = 1 - x;

    while (x >= y) {
        drawEight(x, y);
        y++;

        if (error < 0) {
            error += 2 * y + 1;
        } else {
            x--;
            error += 2 * (y - x + 1);
        }
    }

}