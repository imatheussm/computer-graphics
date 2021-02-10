import * as Canvas from "../../elements/Canvas.js";
import * as Instructions from "../../elements/Instructions.js";
import * as Line from "../draw/Line.js";

import * as array from "../../utilities/array.js";
import * as colors from "../../constants/colors.js";

let countDigit, rotationDegrees, matrix, newPoints, scaledCoordinates;

export function initialize() {
    countDigit = 0;
    rotationDegrees = 0;
    newPoints = [];


    if (Line.visitedPoints !== undefined && Canvas.isPainted(Line.visitedPoints[0], colors.RED)) {
        Canvas.disableEvents();
        $(document).on("keypress", getRotationDegreesEvent);
        Instructions.showMessage("Type three numbers to indicate the rotation degree.");
    }
}

function getRotationDegreesEvent(event) {
    if (event.which >= 48 && event.which <= 57) {
        let digit = event.which - 48;

        if (countDigit === 0) rotationDegrees = 100 * digit;
        else if (countDigit === 1) rotationDegrees += 10 * digit;
        else {
            rotationDegrees += digit;
            rotationDegrees *= 0.0174533;

            runRotation();

            return initialize();
        }

        countDigit += 1;
    }
}

function runRotation() {
    let [x0, y0] = Line.visitedPoints[0];

    matrix = [
        [Math.cos(rotationDegrees), -Math.sin(rotationDegrees)],
        [Math.sin(rotationDegrees),  Math.cos(rotationDegrees)]
    ];

    for (let i = 0; i < Line.visitedPoints.length; i++)
        newPoints.push([Line.visitedPoints[i][0] - x0, Line.visitedPoints[i][1] - y0]);

    draw();
}

function draw() {
    scaledCoordinates = array.multiplyAndAddFixedPoint(newPoints, matrix, Line.visitedPoints[0]);

    for (let i = 0; i < Line.visitedPoints.length; i++) {
        let previousPoint = Line.visitedPoints[i];
        let nextPoint = Line.visitedPoints[(i + 1) % Line.visitedPoints.length];
        Line.erase(previousPoint, nextPoint);
    }

    Line.transformVisitedPoints(scaledCoordinates);

    for (let i = 0; i < scaledCoordinates.length; i++) {
        let previousPoint = scaledCoordinates[i];
        previousPoint[0] = Math.round(previousPoint[0]);
        previousPoint[1] = Math.round(previousPoint[1]);
        let nextPoint = scaledCoordinates[(i + 1) % scaledCoordinates.length];
        nextPoint[0] = Math.round(nextPoint[0]);
        nextPoint[1] = Math.round(nextPoint[1]);
        Line.draw(previousPoint, nextPoint);
    }

    Canvas.refresh();
}

function matrixMult(point, matrix) {
    let result = [0,0];
    let fixedPoint = Line.visitedPoints[0];

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            result[i] += matrix[i][j] * point[j];
        }
        result[i] += fixedPoint[i];
    }
    return result;
}