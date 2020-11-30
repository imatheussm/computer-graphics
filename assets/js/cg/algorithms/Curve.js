import * as tools from "../tools.js"; tools.extendMath();
import * as constants from "../constants.js";
import * as Line from "./Line.js";

let num_lines = 3;
let control_points = [];
let initial_point = [0, 0];
let final_point = [0, 0];
let points_to_draw = [];
let initialCoordinates = [0, 0];
let finalCoordinates = [0, 0];


export function initializer() {
    points_to_draw = [];
    control_points = [];
    final_point = [0, 0];
    initialCoordinates = [];
    finalCoordinates = [];

    constants.CANVAS.off("click").on("click", initialPointEvent);
    tools.showMessage("Choose the INITIAL point of the curve.");
}

function initialPointEvent(event) {
    initial_point = tools.getCoordinates(event);
    tools.paintSquare(initial_point);
    control_points.push(initial_point);
    points_to_draw.push(initial_point);

    constants.CANVAS.off("click").on("click", finalPointEvent);
    tools.showMessage("Choose the FINAL point of the curve.");
}

function finalPointEvent(event) {
    final_point = tools.getCoordinates(event);

    tools.paintSquare(final_point);

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
    control_points.push(point);

    if (control_points.length - 1 === num_lines) {
        constants.CANVAS.off("click");
        enterKeyEvent();
    }
}

function enterKeyEvent() {
    control_points.push(final_point);
    draw();
    initializer();
}

function belzierPoint(t) {
    const degree = control_points.length - 1;
    const points = control_points.slice();

    for (let r = 1; r <= degree; r++){
        for (let i = 0; i <= degree - r; i++){
            const firstMultiplication = Math.scalarMultiplication(points[i], (1.0 - t));
            const secondMultiplication = Math.scalarMultiplication(points[i + 1], t);

            points[i] = Math.vectorAddition(firstMultiplication, secondMultiplication);
        }
    }

    return points[0];
}

function draw() {
    initialCoordinates = initial_point;
    let t;
    for (let i = 1; i <= num_lines; i++) {
        t = (1.0 / num_lines) * i;
        const final_point = belzierPoint(t);
        // burro, tem que mudar
        finalCoordinates = [parseInt(final_point[0]), parseInt(final_point[1])]
        Line.draw(initialCoordinates, finalCoordinates);
        initialCoordinates = finalCoordinates;
    }
}