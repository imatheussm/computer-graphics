import * as Canvas from "../elements/Canvas.js";
import * as Instructions from "../elements/Instructions.js";
import * as Array from "../utilities/Array.js";
import * as colors from "../constants/Colors.js";
import {paintPixel} from "../elements/Canvas.js";

let point, visitedPoints;

export function initialize() {
    $(document).off("keypress");
    Canvas.CANVAS.off("click").on("click", borderEvent);
    Instructions.showMessage("Click on the point of an object.");
}

function borderEvent(event) {
    point = Canvas.getCoordinates(event);

    visitedPoints = [];
    getPolygonPoints(point, colors.RED);
    console.log(visitedPoints);
    paintPixel(point, colors.BLUE, false);
    Instructions.showMessage("Click on a new point to translate the object.");
    Canvas.CANVAS.off("click").on("click", newPointEvent);
}


function newPointEvent(event) {
    point = Canvas.getCoordinates(event);

    let x0 = visitedPoints[0][0];
    let y0 = visitedPoints[0][1];
    let x1 = point[0];
    let y1 = point[1];
    let diff_x = x1 - x0;
    let diff_y = y1 - y0;
    let newPoints = arrayScalarSum(visitedPoints, diff_x, 0)
    newPoints = arrayScalarSum(newPoints, diff_y, 1)

    //erase previous points
    for (let i=0; i <visitedPoints.length; i++){
        paintPixel(visitedPoints[i], colors.BLACK, true);
    }

    // paint new points
    for (let i=0; i <newPoints.length; i++){
        paintPixel(newPoints[i], colors.RED, true);
    }
    Instructions.showMessage("Click on the point of an object.");
    Canvas.CANVAS.off("click").on("click", borderEvent);
}

function arrayScalarSum(array, scalar, index){
    let result = [];
    for (let i=0; i < array.length; i++){
        let new_point = [array[i][0], array[i][1]];
        new_point[index] += scalar;
        result.push(new_point);
    }
    return result;
}

function getPolygonPoints(point, edgeColor) {
    let pixelColor = Canvas.getColorPixel(point);

    let adjacency = [
        [point[0] + 1, point[1] + 1],
        [point[0] + 1, point[1] + 0],
        [point[0] + 1, point[1] - 1],
        [point[0] + 0, point[1] + 1],
        [point[0] + 0, point[1] + 0],
        [point[0] + 0, point[1] - 1],
        [point[0] - 1, point[1] + 1],
        [point[0] - 1, point[1] + 0],
        [point[0] - 1, point[1] - 1],
    ]

    let isEdge = pixelColor === edgeColor;
    let notVisited = Array.includesArray(visitedPoints, point) === false;

    if (notVisited && isEdge) {
        visitedPoints.push(point);
        for (let p = 0; p < adjacency.length; p++) getPolygonPoints(adjacency[p], edgeColor);
    }
}