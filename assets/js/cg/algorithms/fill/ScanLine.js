import * as Canvas from "../../elements/Canvas.js";
import * as Instructions from "../../elements/Instructions.js";

import * as Line from "../draw/Line.js";

import * as colors from "../../constants/colors.js";

let criticalPoints, activeCriticalPoints, yMax, yMin;

export function initialize() {
    Canvas.disableEvents();
    getBoundingBox();
    scanLine();
    Instructions.showMessage("Select an algorithm to continue.");
}


function getInvSlope(pAux, point) {
    return (1.0 * pAux[0] - point[0]) / (1.0 * pAux[1] - point[1]);
}

function getBoundingBox() {
    yMin = Canvas.virtualHeight;
    yMax = 0;
    criticalPoints = [];
    for (let i = 0; i < Line.visitedPoints.length; i++) {
        let point = Line.visitedPoints[i];
        let y = point[1], x = point[0];
        if (y < yMin) {
            yMin = y;
        } else if (y > yMax) {
            yMax = y;
        }
        let pAux = Line.visitedPoints[(i + 1) % Line.visitedPoints.length];
        if (y < pAux[1]) {
            criticalPoints.push({
                "index": i,
                "dir": 1,
                "x_intersection": x,
                "inv_slope": getInvSlope(pAux, point)
            })
        }
        pAux = Line.visitedPoints[(i - 1 + Line.visitedPoints.length) % Line.visitedPoints.length];
        if (y < pAux[1]) {
            criticalPoints.push({
                "index": i,
                "dir": -1,
                "x_intersection": x,
                "inv_slope": getInvSlope(pAux, point)
            })
        }

    }
}

function bubbleSortPoint(inputArr) {
    let len = inputArr.length, swapped, valueI, valueIPlus, tmp;

    do {
        swapped = false;

        for (let i = 0; i < len - 1; i++) {
            valueI = inputArr[i].x_intersection;
            valueIPlus = inputArr[i+1].x_intersection;

            if (valueI > valueIPlus) {
                tmp = inputArr[i];
                inputArr[i] = inputArr[i + 1];
                inputArr[i + 1] = tmp;
                swapped = true;
            }
        }
    } while (swapped === true);

    return inputArr;
}

function scanLine() {
    activeCriticalPoints = [];

    if (Line.visitedPoints !== undefined && Canvas.isPainted(Line.visitedPoints[0], colors.RED) === true) {
        for (let y = yMin; y <= yMax; y++) {

            //update x_intersection on activePoints
            for (let i = 0; i < activeCriticalPoints.length; i++) {
                let point = activeCriticalPoints[i];
                point.x_intersection += point.inv_slope;
                activeCriticalPoints[i] = point;
            }

            //Add lines with critical points for the given y
            for (let i = 0; i < criticalPoints.length; i++) {
                let point = criticalPoints[i];
                if (Line.visitedPoints[point.index][1] === y) {
                    activeCriticalPoints.push(point);
                }
            }

            //Remove points with y equal to y_max
            for (let i = activeCriticalPoints.length - 1; i >= 0; i--) {
                let point = activeCriticalPoints[i];
                let index = (point.index + point.dir + Line.visitedPoints.length) % Line.visitedPoints.length;
                let pMax = Line.visitedPoints[index];
                if (pMax[1] === y) {
                    activeCriticalPoints.splice(i, 1);
                }
            }

            //Order active points based on the x for the given y
            bubbleSortPoint(activeCriticalPoints);

            //Paint between each pair of active points
            for (let i = 0; i < activeCriticalPoints.length; i += 2) {
                let xStart = Math.round(activeCriticalPoints[i].x_intersection);
                let xEnd = Math.round(activeCriticalPoints[i + 1].x_intersection);
                for (let x = xStart; x < xEnd; x++) {
                    let pixelColor = Canvas.getColorPixel([x, y]);
                    if (pixelColor !== colors.RED) {
                        Canvas.paintPixel([x, y], colors.GREEN, true);
                    }
                }
            }
        }
    }

}