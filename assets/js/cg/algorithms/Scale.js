import * as Canvas from "../elements/Canvas.js";
import * as Instructions from "../elements/Instructions.js";
import * as colors from "../constants/Colors.js";
import {paintPixel} from "../elements/Canvas.js";
import * as Line from "./Line.js";

let point, matrix, newPoints, xScaleSign, yScaleSign, xScale, yScale;

export function initialize() {
    $(document).off("keypress");
    Canvas.CANVAS.off("click").on("click", borderEvent);
    Instructions.showMessage("Click in a point of the object to fix it.");
}

function borderEvent(event) {
    point = Canvas.getCoordinates(event);
    newPoints = [];
    paintPixel(point, colors.BLUE, false);
    Instructions.showMessage("Press number 0 if the scale on the X axis is negative, and press 1 if is positive.");
    Canvas.CANVAS.off("click")
    $(document).on("keypress", xScaleSignEvent);
}

function xScaleSignEvent(event) {
    if (event.which === 48 || event.which === 49) {
        if (event.which === 48){
            xScaleSign = -1;
        } else {
            xScaleSign = 1;
        }
        console.log('xscaleSign',xScaleSign);
        $(document).off("keypress");
        $(document).on("keypress", xScaleMagnitudeEvent);
        Instructions.showMessage("Pres on a key [1-9] to define the magnitue of the scale on the X axis.");
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
        if (event.which === 48){
            yScaleSign = -1;
        } else {
            yScaleSign = 1;
        }
        console.log('yscaleSign',yScaleSign);
        Instructions.showMessage("Pres on a key [1-9] to define the magnitue of the scale on the Y axis.");
        $(document).off("keypress").on("keypress", yScaleMagnitudeEvent);
    }
}

function yScaleMagnitudeEvent(event) {
    if (event.which >= 49 && event.which <= 57) {
        yScale = event.which - 48;
        $(document).off("keypress");
        Canvas.CANVAS.off("click").on("click", borderEvent);
        runScale();
        Instructions.showMessage("Click in a point of the object to fix it.");
    }
}


function runScale() {

    let fixed_point = Line.visitedPoints[0];
    let x0 = fixed_point[0];
    let y0 = fixed_point[1];

    let scale_x = xScale * xScaleSign;
    console.log('yscaleSign',yScaleSign);
    console.log('xscaleSign',xScaleSign);
    let scale_y = yScale * yScaleSign;
    matrix = [[scale_x, 0], [0, scale_y]];

    for(let i=0; i< Line.visitedPoints.length; i++){
        let newPoint = [0, 0];
        newPoint[0] = Line.visitedPoints[i][0];
        newPoint[1] = Line.visitedPoints[i][1];
        newPoint[0] -= x0;
        newPoint[1] -= y0;
        newPoints.push(newPoint);
    }
    draw();
}

function draw(){
    let scaledCoordinates = [];
    for (let i=0; i < newPoints.length; i++){
        let point = newPoints[i];
        scaledCoordinates.push(matrixMult(point, matrix));
    }

    //erase previous points
    for (let i=0; i <Line.visitedPoints.length; i++){
        let previousPoint = Line.visitedPoints[i];
        let nextPoint = Line.visitedPoints[(i+1) % Line.visitedPoints.length];
        Line.draw(previousPoint, nextPoint, colors.BLACK);
    }


    for (let i=0; i < scaledCoordinates.length; i++){
        let previousPoint = scaledCoordinates[i];
        console.log(previousPoint);
        let nextPoint = scaledCoordinates[(i+1) % scaledCoordinates.length];
        Line.draw(previousPoint, nextPoint);
    }
}

function matrixMult(point, matrix){

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