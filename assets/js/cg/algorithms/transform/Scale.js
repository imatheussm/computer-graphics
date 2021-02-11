import * as Canvas from "../../elements/Canvas.js";
import * as Instructions from "../../elements/Instructions.js";

import * as Line from "../draw/Line.js";

import * as array from "../../utilities/array.js";
import * as colors from "../../constants/colors.js";

let point, matrix, newPoints, xScaleSign, yScaleSign, xScale, yScale, scaledCoordinates;

export function initialize() {
    Canvas.disableEvents();
    Canvas.CANVAS.on("click", borderEvent);
    Instructions.showMessage("Click in a point of the object to fix it.");
}

function borderEvent(event) {
    point = Canvas.getCoordinates(event);
    newPoints = [];


    Canvas.paintPixel(point, colors.BLUE, false);
    Instructions.showMessage("Press number 0 if the scale on the X axis is negative, and press 1 if is positive.");
    Canvas.CANVAS.off("click")
    $(document).on("keypress", xScaleSignEvent);
}

function xScaleSignEvent(event) {
    if (event.which === 48 || event.which === 49) {
        if (event.which === 48) xScaleSign = -1;
        else xScaleSign = 1;

        $(document).off("keypress");
        $(document).on("keypress", xScaleMagnitudeEvent);
        Instructions.showMessage("Pres on a key [1-9] to define the magnitude of the scale on the X axis.");
    }
}

function xScaleMagnitudeEvent(event) {
    if (event.which >= 49 && event.which <= 57) {
        xScale = event.which - 48;

        $(document).off("keypress").on("keypress", yScaleSignEvent);
        Instructions.showMessage("Press number 0 if the scale on the Y axis is negative, and press 1 if is positive.");
    }
}

function yScaleSignEvent(event) {
    if (event.which === 48 || event.which === 49) {
        if (event.which === 48) yScaleSign = -1;
        else yScaleSign = 1;

        Instructions.showMessage("Pres on a key [1-9] to define the magnitude of the scale on the Y axis.");
        $(document).off("keypress").on("keypress", yScaleMagnitudeEvent);
    }
}

function yScaleMagnitudeEvent(event) {
    if (event.which >= 49 && event.which <= 57) {
        yScale = event.which - 48;

        runScale();
        draw();
        initialize();
    }
}


function runScale() {
    let fixed_point = Line.visitedPoints[0];
    let [x0, y0] = fixed_point;
    let [scaleX, scaleY] = [xScale * xScaleSign, yScale * yScaleSign];

    matrix = [[scaleX, 0], [0, scaleY]];

    for (let i = 0; i < Line.visitedPoints.length; i++) {
        let newPoint = [0, 0];
        newPoint[0] = Line.visitedPoints[i][0];
        newPoint[1] = Line.visitedPoints[i][1];
        newPoint[0] -= x0;
        newPoint[1] -= y0;
        newPoints.push(newPoint);
    }
}

function draw() {
    scaledCoordinates = array.multiplyAndAddFixedPoint(newPoints, matrix, Line.visitedPoints[0]);

    for (let i = 0; i < Line.visitedPoints.length; i++) {
        let previousPoint = Line.visitedPoints[i];
        let nextPoint = Line.visitedPoints[(i + 1) % Line.visitedPoints.length];
        Line.erase(previousPoint, nextPoint);
    }


    for (let i = 0; i < scaledCoordinates.length; i++) {
        let previousPoint = scaledCoordinates[i];
        let nextPoint = scaledCoordinates[(i + 1) % scaledCoordinates.length];
        Line.draw(previousPoint, nextPoint);
    }

    Canvas.refresh();
}
