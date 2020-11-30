import * as globals from "../globals.js";
import * as tools from "../tools.js";

import * as Canvas from "../Canvas.js";

let point;

export function initializer() {
    point = null;

    tools.showMessage("Choose at least 2 points to draw lines on the screen. Press ENTER to end a polyline.");

    globals.CANVAS.off("click").on("click", handleClick);
    $(document).off("keypress").off("keyup").on("keyup", handleKeyUp);
}

function handleClick(event) {
    if (point == null) {
        point = tools.getCoordinates(event);
        Canvas.paintPixel(point);
    } else {
        const newPoint = tools.getCoordinates(event);
        draw(point, newPoint);
        point = newPoint;
    }
}

function handleKeyUp(event) {
    if (event.keyCode === 13) {
        point = null;
    }
}

export function draw(initialCoordinates, finalCoordinates) {
    let [x0, y0] = initialCoordinates.map(c => parseInt(c));
    let [x1, y1] = finalCoordinates.map(c => parseInt(c));

    let [deltaX, deltaY] = [Math.abs(x1 - x0), Math.abs(y1 - y0)];
    let [signalX, signalY] = [(x0 < x1 ? 1 : -1), (y0 < y1 ? 1 : -1)];

    let error = deltaX - deltaY;


    while(true) {
        if ((x0 === x1) && (y0 === y1)) break;

        let twoTimesError = 2 * error;

        if (twoTimesError > -deltaY) { error -= deltaY; x0 += signalX; }
        if (twoTimesError <  deltaX) { error += deltaX; y0 += signalY; }

        Canvas.paintPixel([x0, y0]);
    }
}