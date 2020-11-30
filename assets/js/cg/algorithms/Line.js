import * as Canvas from "../elements/Canvas.js";
import * as Instructions from "../elements/Instructions.js";

let point;

export function initialize() {
    point = null;

    Instructions.showMessage("Choose at least 2 points to draw lines on the screen. Press ENTER to end a polyline.");

    Canvas.CANVAS.off("click").on("click", handleClick);
    $(document).off("keypress").off("keyup").on("keyup", handleKeyUp);
}

function handleClick(event) {
    if (point == null) {
        point = Canvas.getCoordinates(event);
        console.log(`point: ${point}`);
        Canvas.paintPixel(point);
    } else {
        const newPoint = Canvas.getCoordinates(event);
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
    console.log("Drawing...");

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