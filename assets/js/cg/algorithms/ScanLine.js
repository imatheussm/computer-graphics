import * as Canvas from "../elements/Canvas.js";
import * as Instructions from "../elements/Instructions.js";

import * as colors from "../constants/colors.js";

let point, visitedPoints, criticalPoints = [], y_max, y_min;

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
    getBoundingBox();
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

function getInvSlope(p_aux, point){
    return (parseFloat(p_aux[0] - point[0])) /
        parseFloat((p_aux[1] - point[1]));
}

function getBoundingBox(){
    y_min = Canvas.VIRTUAL_HEIGHT;
    y_max = 0;
    criticalPoints = [];
    for (let i=0; i < visitedPoints.length; i++) {
        let point = visitedPoints[i];
        let y = point[1], x = point[0];
        if (y < y_min) {
            y_min = y;
        } else if (y > y_max) {
            y_max = y;
        }
        let p_aux = visitedPoints[(i + 1) % visitedPoints.length];
        let inv_slope = getInvSlope(p_aux, point);
        if (y < p_aux[1]) {
            criticalPoints.push({
                "index": i,
                "dir": 1,
                "x_intersection": x,
                "inv_slope": inv_slope
            })
        }
        p_aux = visitedPoints[(i - 1 + visitedPoints.length) % visitedPoints.length];
        if (y < p_aux[1]) {
            criticalPoints.push({
                "index": i,
                "dir": -1,
                "x_intersection": x,
                "inv_slope": inv_slope
            })
        }

    }
}