import * as Instructions from "../elements/Instructions.js";

import * as Canvas from "../elements/Canvas.js";
import * as Line from "./Line.js";

let initialCoordinates, finalCoordinates;
let controlPoints, num_lines;

Math.vectorAddition = function(firstVector, secondVector) {
    return firstVector.map((x, i) => x + secondVector[i])
}

Math.scalarMultiplication = function(vector, scalar) {
    return vector.map(x => x * scalar);
}

export function initialize() {
    controlPoints = [];

    Canvas.CANVAS.off("click").on("click", initialPointEvent);
    Instructions.showMessage("Choose the INITIAL point of the curve.");
}

function initialPointEvent(event) {
    initialCoordinates = Canvas.getCoordinates(event);
    Canvas.paintPixel(initialCoordinates);
    controlPoints.push(initialCoordinates);

    Canvas.CANVAS.off("click").on("click", finalPointEvent);
    Instructions.showMessage("Choose the FINAL point of the curve.");
}

function finalPointEvent(event) {
    finalCoordinates = Canvas.getCoordinates(event);

    Canvas.paintPixel(finalCoordinates);

    Canvas.CANVAS.off("click");
    $(document).on("keypress", numLinesEvent);
    Instructions.showMessage("Press a number key (1-9) with the number of lines to draw the curve.");
}

function numLinesEvent(event) {
    if (event.which >= 49 && event.which <= 57){
        num_lines = event.which - 48;
    }

    $(document).off("keypress");
    Canvas.CANVAS.on("click", controlPointsEvent);
    Instructions.showMessage("Click on CONTROL points.");
}

function controlPointsEvent(event) {
    const point = Canvas.getCoordinates(event);
    Canvas.paintPixel(point);
    controlPoints.push(point);

    if (controlPoints.length - 1 === num_lines) {
        Canvas.CANVAS.off("click");
        controlPoints.push(finalCoordinates);
        draw();
        initialize();
    }
}

function belzierPoint(t) {
    const degree = controlPoints.length - 1;

    for (let r = 1; r <= degree; r++){
        for (let i = 0; i <= degree - r; i++){
            const firstMultiplication = Math.scalarMultiplication(controlPoints[i], (1.0 - t));
            const secondMultiplication = Math.scalarMultiplication(controlPoints[i + 1], t);

            controlPoints[i] = Math.vectorAddition(firstMultiplication, secondMultiplication);
        }
    }

    return controlPoints[0];
}

function draw() {
    let t;

    for (let i = 1; i <= num_lines; i++) {
        t = (1.0 / num_lines) * i;
        finalCoordinates = belzierPoint(t);
        Line.draw(initialCoordinates, finalCoordinates);
        initialCoordinates = finalCoordinates;
    }
}