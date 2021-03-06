import * as Canvas from "../../elements/Canvas.js";
import * as Instructions from "../../elements/Instructions.js";

import * as colors from "../../constants/colors.js";

let center, radius;

export function initialize() {
    Canvas.disableEvents();
    Canvas.CANVAS.on("click", centerEvent);
    Instructions.showMessage("Choose a point to define the CENTER of the circle.");
}

function centerEvent(event) {
    center = Canvas.getCoordinates(event);


    Canvas.paintPixel(center, colors.BLUE, false);

    Canvas.CANVAS.off("click").on("click", radiusEvent);
    Instructions.showMessage("Choose another point to define the RADIUS of the circle.");
}

function radiusEvent(event) {
    const border = Canvas.getCoordinates(event);
    const xDist = Math.pow(center[0] - border[0], 2);
    const yDist = Math.pow(center[1] - border[1], 2);
    radius = parseInt(Math.sqrt(xDist + yDist).toString());


    draw();
    Canvas.refresh();
    initialize();
}

function drawEight(x, y) {
    Canvas.paintPixel([ x + center[0],  y + center[1]], colors.RED, true);
    Canvas.paintPixel([ y + center[0],  x + center[1]], colors.RED, true);
    Canvas.paintPixel([ y + center[0], -x + center[1]], colors.RED, true);
    Canvas.paintPixel([ x + center[0], -y + center[1]], colors.RED, true);
    Canvas.paintPixel([-x + center[0], -y + center[1]], colors.RED, true);
    Canvas.paintPixel([-y + center[0], -x + center[1]], colors.RED, true);
    Canvas.paintPixel([-y + center[0],  x + center[1]], colors.RED, true);
    Canvas.paintPixel([-x + center[0],  y + center[1]], colors.RED, true);
}

function draw() {
    let [x, y] = [radius, 0];
    let error = 1 - x;

    while (x >= y) {
        drawEight(x, y);
        y++;

        if (error < 0) error += 2 * y + 1;
        else {
            x--;
            error += 2 * (y - x + 1);
        }
    }

}