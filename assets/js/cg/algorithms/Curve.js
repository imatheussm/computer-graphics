import * as tools from "../tools.js"; tools.extendMath();
import * as constants from "../constants.js";
import * as Line from "./Line.js";

let initialCoordinates, finalCoordinates;
let controlPoints, num_lines;


export function initializer() {
    controlPoints = [];

    constants.CANVAS.off("click").on("click", initialPointEvent);
    tools.showMessage("Choose the INITIAL point of the curve.");
}

function initialPointEvent(event) {
    initialCoordinates = tools.getCoordinates(event);
    tools.paintSquare(initialCoordinates);
    controlPoints.push(initialCoordinates);

    constants.CANVAS.off("click").on("click", finalPointEvent);
    tools.showMessage("Choose the FINAL point of the curve.");
}

function finalPointEvent(event) {
    finalCoordinates = tools.getCoordinates(event);

    tools.paintSquare(finalCoordinates);

    constants.CANVAS.off("click");
    $(document).on("keypress", numLinesEvent);
    tools.showMessage("Press a number key (1-9) with the number of lines to draw the curve.");
}

function numLinesEvent(event) {
    if (event.which >= 49 && event.which <= 57){
        num_lines = event.which - 48;
    }

    $(document).off("keypress");
    constants.CANVAS.on("click", controlPointsEvent);
    tools.showMessage("Click on CONTROL points.");
}

function controlPointsEvent(event) {
    const point = tools.getCoordinates(event);
    tools.paintSquare(point);
    controlPoints.push(point);

    if (controlPoints.length - 1 === num_lines) {
        constants.CANVAS.off("click");
        controlPoints.push(finalCoordinates);
        draw();
        initializer();
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