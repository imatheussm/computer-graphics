import * as Canvas from "../../elements/Canvas.js";
import * as Instructions from "../../elements/Instructions.js";
import * as Array from "../../utilities/array.js";
import * as colors from "../../constants/colors.js";

let point, visitedPoints, criticalPoints, activeCriticalPoints, y_max, y_min;

export function initialize() {

    $(document).off("keypress");
    Canvas.CANVAS.off("click").on("click", borderEvent);
    Instructions.showMessage("Choose a POINT of the BORDER of the object to fill.");
}

function borderEvent(event) {
    point = Canvas.getCoordinates(event);
    visitedPoints = [];
    getPolygonPoints(point, colors.RED);

    getBoundingBox();
    scanLine();
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

function getInvSlope(p_aux, point){
    return (1.0*p_aux[0] - point[0]) / (1.0*p_aux[1] - point[1]);
}

function getBoundingBox(){
    y_min = Canvas.virtualHeight - 1;
    y_max = 0;
    criticalPoints = [];
    for (let i = 0; i < visitedPoints.length; i++) {
        let point = visitedPoints[i];
        let y = point[1], x = point[0];
        if (y < y_min) {
            y_min = y;
        } else if (y > y_max) {
            y_max = y;
        }
        let p_aux = visitedPoints[(i + 1) % visitedPoints.length];
        if (y < p_aux[1]) {
            criticalPoints.push({
                "index": i,
                "dir": 1,
                "x_intersection": x,
                "inv_slope": getInvSlope(p_aux, point)
            })
        }
        p_aux = visitedPoints[(i - 1 + visitedPoints.length) % visitedPoints.length];
        if (y < p_aux[1]) {
            criticalPoints.push({
                "index": i,
                "dir": -1,
                "x_intersection": x,
                "inv_slope": getInvSlope(p_aux, point)
            })
        }

    }
}

function bubbleSortPoint(inputArr){
    let len = inputArr.length;

    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < len - 1; i++) {
            let value_i = inputArr[i].x_intersection;
            let value_i_plus = inputArr[i+1].x_intersection;
            if (value_i > value_i_plus) {
                let tmp = inputArr[i];
                inputArr[i] = inputArr[i + 1];
                inputArr[i + 1] = tmp;
                swapped = true;
            }
        }
    } while (swapped);
    return inputArr;
}

function scanLine(){
    activeCriticalPoints = [];
    for (let y = y_min; y <= y_max; y++){

        //update x_intersection on activePoints
        for (let i = 0; i < activeCriticalPoints.length; i++){
            let point = activeCriticalPoints[i];
            point.x_intersection += point.inv_slope;
            activeCriticalPoints[i] = point;
        }

        //Add lines with critical points for the given y
        for (let i=0; i < criticalPoints.length; i++){
            let point = criticalPoints[i];
            if (visitedPoints[point.index][1] === y){
                activeCriticalPoints.push(point);
            }
        }

        //Remove points with y equal to y_max
        for (let i = activeCriticalPoints.length - 1; i >= 0; i--){
            let point = activeCriticalPoints[i];
            let index = (point.index + point.dir + visitedPoints.length) % visitedPoints.length;
            let p_max = visitedPoints[index];
            if (p_max[1] === y){
                activeCriticalPoints.splice(i, 1);
            }
        }

        //Order active points based on the x for the given y
        bubbleSortPoint(activeCriticalPoints);

        //Paint between each pair of active points
        for (let i=0; i < activeCriticalPoints.length; i += 2){
            let x_start  = Math.round(activeCriticalPoints[i].x_intersection);
            let x_end = Math.round(activeCriticalPoints[i+1].x_intersection);
            for (let x = x_start; x <= x_end; x++){
                Canvas.paintPixel([x, y], colors.GREEN);
            }
        }

    }

}