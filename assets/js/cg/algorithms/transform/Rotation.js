import * as Canvas from "../../elements/Canvas.js";
import * as Instructions from "../../elements/Instructions.js";
import * as colors from "../../constants/colors.js";
import * as Line from "../draw/Line.js";

let point, countDigit, rotationDegrees, matrix, newPoints;

export function initialize() {
    $(document).off("keypress");
    Canvas.CANVAS.off("click").on("click", borderEvent);
    Instructions.showMessage("Click in a point of the object to fix it.");
}

function borderEvent(event) {
    point = Canvas.getCoordinates(event);
    countDigit = 0;
    newPoints = [];

    Canvas.paintPixel(point, colors.BLUE, false);
    Instructions.showMessage("Type three numbers to indicate the rotation degree");
    Canvas.CANVAS.off("click");
    $(document).on("keypress", getRotationDegreesEvent);
}

function getRotationDegreesEvent(event){
    if (event.which >= 48 && event.which <= 57){
        let digit = event.which - 48;
        if (countDigit === 0) {
            rotationDegrees = 100 * digit;
        } else if (countDigit === 1) {
            rotationDegrees += 10*digit;
        } else{
            rotationDegrees += digit;
            rotationDegrees = 0.0174533*rotationDegrees;
            $(document).off("keypress");
            Instructions.showMessage("Click in a point of the object to fix it.");
            Canvas.CANVAS.off("click").on("click", borderEvent);
            runRotation();
        }
        countDigit += 1;
    }
}

function runRotation() {
    let fixed_point = Line.visitedPoints[0];
    let x0 = fixed_point[0];
    let y0 = fixed_point[1];

    matrix = [[Math.cos(rotationDegrees), -Math.sin(rotationDegrees)],
              [Math.sin(rotationDegrees), Math.cos(rotationDegrees)]];

    for (let i = 0; i< Line.visitedPoints.length; i++) {
        let newPoint = [0, 0];
        newPoint[0] = Line.visitedPoints[i][0];
        newPoint[1] = Line.visitedPoints[i][1];
        newPoint[0] -= x0;
        newPoint[1] -= y0;
        newPoints.push(newPoint);
    }
    draw();
}

function draw() {
    let scaledCoordinates = [];

    for (let i=0; i < newPoints.length; i++) {
        let point = newPoints[i];
        scaledCoordinates.push(matrixMult(point, matrix));
    }

    for (let i = 0; i <Line.visitedPoints.length; i++) {
        let previousPoint = Line.visitedPoints[i];
        let nextPoint = Line.visitedPoints[(i + 1) % Line.visitedPoints.length];
        Line.draw(previousPoint, nextPoint, colors.BLACK);
    }

    for (let i = 0; i < scaledCoordinates.length; i++) {
        let previousPoint = scaledCoordinates[i];
        previousPoint[0] = Math.round(previousPoint[0]);
        previousPoint[1] = Math.round(previousPoint[1]);
        let nextPoint = scaledCoordinates[(i + 1) % scaledCoordinates.length];
        nextPoint[0] = Math.round(nextPoint[0]);
        nextPoint[1] = Math.round(nextPoint[1]);
        Line.draw(previousPoint, nextPoint);
    }
}

function matrixMult(point, matrix) {
    let result = [0,0];
    let fixedPoint = Line.visitedPoints[0];

    for (let i=0; i<2; i++){
        for (let j=0;j<2; j++){
            result[i] += matrix[i][j] * point[j];
        }
        result[i] += fixedPoint[i];
    }
    return result;
}