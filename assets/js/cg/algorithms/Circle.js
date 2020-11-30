import * as tools from "../tools.js";
import * as globals from "../globals.js";

import * as Canvas from "../Canvas.js";

let center, radius;

export function initializer() {
    globals.CANVAS.off("click").on("click", centerEvent);
    tools.showMessage("Choose a point to define the CENTER of the circle.");
}

function centerEvent(event) {
    center = tools.getCoordinates(event);
    Canvas.paintPixel(center, globals.BLUE);

    globals.CANVAS.off("click").on("click", radiusEvent);
    tools.showMessage("Choose another point to define the RADIUS of the circle.");
}

function radiusEvent(event) {
    const border = tools.getCoordinates(event);
    const x_dist = Math.pow(center[0] - border[0], 2);
    const y_dist = Math.pow(center[1] - border[1], 2);
    radius = parseInt(Math.sqrt(x_dist + y_dist).toString());

    draw();

    globals.CANVAS.off("click").on("click", centerEvent);
    tools.showMessage("Choose a point to define the CENTER of the circle.");
}

function drawEight(x, y) {
    Canvas.paintPixel([ x + center[0],  y + center[1]]);
    Canvas.paintPixel([ y + center[0],  x + center[1]]);
    Canvas.paintPixel([ y + center[0], -x + center[1]]);
    Canvas.paintPixel([ x + center[0], -y + center[1]]);
    Canvas.paintPixel([-x + center[0], -y + center[1]]);
    Canvas.paintPixel([-y + center[0], -x + center[1]]);
    Canvas.paintPixel([-y + center[0],  x + center[1]]);
    Canvas.paintPixel([-x + center[0],  y + center[1]]);
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