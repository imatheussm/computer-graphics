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


function resetInstructions() {
    constants.INSTRUCTIONS.html("Choose INITIAL point of the curve.");
    constants.INSTRUCTIONS.css("visibility", "visible");
}

function controlPointsEvent(event) {
    const point = tools.getCoordinates(event);
    tools.paintSquare(point);
    control_points.push(point);
}

function initialPointEvent(event) {
    constants.INSTRUCTIONS.html("Choose FINAL point of the curve.");
    constants.INSTRUCTIONS.css("visibility", "visible");

    const point = tools.getCoordinates(event);
    tools.paintSquare(point);
    initial_point = point;
    control_points.push(point);
    points_to_draw.push(point);
    constants.CANVAS.off("click");
    constants.CANVAS.on("click", finalPointEvent);
}

function finalPointEvent(event) {
    constants.INSTRUCTIONS.html("Pres a number key (1-9) with the number of lines to draw the curve.");
    constants.INSTRUCTIONS.css("visibility", "visible");
    const point = tools.getCoordinates(event);
    tools.paintSquare(point);
    final_point = point;
    final_point = point;
    constants.CANVAS.off("click");
    $(document).on("keypress", numLinesEvent);
}

function numLinesEvent(event) {
    $(document).off("keypress");
    constants.INSTRUCTIONS.html("Click on CONTROL points. Press ENTER to draw the curve.");
    constants.INSTRUCTIONS.css("visibility", "visible");
    constants.CANVAS.off("click");
    if (event.which >= 49 && event.which <= 57){
        num_lines = event.which - 48;
    }
    constants.CANVAS.off("click");
    constants.CANVAS.on("click", controlPointsEvent);
    $(document).on("keypress", enterKeyEvent);
}

function enterKeyEvent(event) {
    constants.CANVAS.off("click");
    control_points.push(final_point);
    if (event.which === 13){
        draw();
    }
    constants.CANVAS.off("click")
    $(document).off("keypress");
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
    for (let i = 1; i <= num_lines; i++){
        t = (1.0 / num_lines) * i;
        const final_point = belzierPoint(t);
        // burro, tem que mudar
        finalCoordinates = [parseInt(final_point[0]), parseInt(final_point[1])]
        Line.draw(initialCoordinates, finalCoordinates);
        initialCoordinates = finalCoordinates;
    }
}

export function initializer() {
    points_to_draw = [];
    control_points = [];
    initial_point = [0,0];
    final_point = [0,0];
    initialCoordinates = [];
    finalCoordinates = [];

    resetInstructions();
    constants.CANVAS.off("click");
    constants.CANVAS.on("click", initialPointEvent);
}