import * as Canvas from "../elements/Canvas.js";
import * as Instructions from "../elements/Instructions.js";

import * as colors from "../constants/colors.js";

let point, visitedPoints;

export function initialize() {
    visitedPoints = [];

    $(document).off("keypress");
    Canvas.CANVAS.off("click").on("click", borderEvent);
    Instructions.showMessage("Choose a POINT of the BORDER of the object to fill.");
}

function isArrayEqual(array1, array2){
    if (array1.length !== array2.length){
        return false;
    }
    for (let i =0; i <array1.length ; i++){
        if (array1[i] !== array2[i]){
            return false;
        }
    }
    return true;
}

function includesArray(upper_array, bottom_array){
    for (let i = 0; i < upper_array.length; i++){
        if (isArrayEqual(upper_array[i], bottom_array)){
            return true
        }
    }
    return false;
}

function borderEvent(event) {
    point = Canvas.getCoordinates(event);

    getPolygonPoints(point, colors.RED);
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
    let notVisited = includesArray(visitedPoints, point) === false;

    if (notVisited && isEdge) {
        visitedPoints.push(point);
        console.log(point);
        for (let p = 0; p < adjacency.length; p++) getPolygonPoints(adjacency[p], edgeColor);
    }
}