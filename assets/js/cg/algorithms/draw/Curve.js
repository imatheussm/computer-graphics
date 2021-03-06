import * as Canvas from "../../elements/Canvas.js";
import * as Instructions from "../../elements/Instructions.js";
import * as Line from "./Line.js";

import * as colors from "../../constants/colors.js";

let initialCoordinates, finalCoordinates,
    controlPoints, numLines,
    t;

export function initialize() {
    controlPoints = [];


    Canvas.disableEvents();
    Canvas.CANVAS.on("click", initialPointEvent);
    Instructions.showMessage("Choose the INITIAL point of the curve.");
}

function initialPointEvent(event) {
    initialCoordinates = Canvas.getCoordinates(event);
    Canvas.paintPixel(initialCoordinates, colors.RED, true);
    controlPoints.push(initialCoordinates);

    Canvas.CANVAS.off("click").on("click", finalPointEvent);
    Instructions.showMessage("Choose the FINAL point of the curve.");
}

function finalPointEvent(event) {
    finalCoordinates = Canvas.getCoordinates(event);

    Canvas.paintPixel(finalCoordinates, colors.RED, true);

    $(document).on("keypress", enterKeyEvent);
    Canvas.CANVAS.off("click").on("click", controlPointsEvent);
    Instructions.showMessage("Click on CONTROL points. Press ENTER when you are done.");
}

function enterKeyEvent(event) {
    if (event.which === 13) {
        Canvas.CANVAS.off("click");
        $(document).off("keypress");
        controlPoints.push(finalCoordinates);
        draw();
        Canvas.refresh();
        initialize();
    }
}

function controlPointsEvent(event) {
    const point = Canvas.getCoordinates(event);


    Canvas.paintPixel(point, colors.BLUE, false);
    controlPoints.push(point);
}

function belzierPoint(t) {
    const degree = controlPoints.length - 1;


    for (let r = 1; r <= degree; r++) {
        for (let i = 0; i <= degree - r; i++) {
            const firstMultiplication = math.multiply(controlPoints[i], (1.0 - t));
            const secondMultiplication = math.multiply(controlPoints[i + 1], t);


            controlPoints[i] = math.add(firstMultiplication, secondMultiplication);
        }
    }

    return controlPoints[0];
}

function draw() {
    numLines = controlPoints.length / 2 + 2;


    for (let i = 1; i <= numLines; i++) {
        t = (1.0 / numLines) * i;
        finalCoordinates = belzierPoint(t);

        Line.draw(initialCoordinates, finalCoordinates);

        initialCoordinates = finalCoordinates;
    }
}
