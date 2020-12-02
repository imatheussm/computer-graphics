import * as Canvas from "../elements/Canvas.js";
import * as Instructions from "../elements/Instructions.js";

import * as colors from "../constants/colors.js";

let point, x0, x1, y0, y1, deltaX, deltaY, signalX, signalY, error, twoTimesError;

export function initialize() {
    point = null;


    Canvas.CANVAS.off("click").on("click", handleClick);
    $(document).off("keypress").off("keyup").on("keyup", handleKeyUp);
    Instructions.showMessage("Choose at least 2 points to draw lines on the screen. Press ENTER to end a polyline.");
}

function handleClick(event) {
    if (point == null) {
        point = Canvas.getCoordinates(event);

        Canvas.paintPixel(point, colors.RED, true);
    } else {
        const newPoint = Canvas.getCoordinates(event);

        draw(point, newPoint);

        point = newPoint;
    }
}

function handleKeyUp(event) {
    if (event.keyCode === 13) point = null;
}

export function draw(initialCoordinates, finalCoordinates) {
    [x0, y0] = initialCoordinates.map(c => parseInt(c));
    [x1, y1] = finalCoordinates.map(c => parseInt(c));

    [deltaX, deltaY] = [Math.abs(x1 - x0), Math.abs(y1 - y0)];
    [signalX, signalY] = [(x0 < x1 ? 1 : -1), (y0 < y1 ? 1 : -1)];

    error = deltaX - deltaY;


    while(true) {
        if ((x0 === x1) && (y0 === y1)) break;

        twoTimesError = 2 * error;

        if (twoTimesError > -deltaY) { error -= deltaY; x0 += signalX; }
        if (twoTimesError <  deltaX) { error += deltaX; y0 += signalY; }

        Canvas.paintPixel([x0, y0], colors.RED, true);
    }
}
