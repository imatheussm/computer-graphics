import * as Canvas from "../../elements/Canvas.js";
import * as Instructions from "../../elements/Instructions.js";

import * as colors from "../../constants/colors.js";

let points, rangeX, rangeY, polygonEdges, pointX;

export function initialize() {
    points = [];


    $(document).off("keypress");
    Canvas.CANVAS.off("click").on("click", initialCoordinatesEvent);
    Instructions.showMessage("Choose one extremity point to define the region wherein to apply the algorithm.");
}

function initialCoordinatesEvent(event) {
    points.push(Canvas.getCoordinates(event));

    Canvas.CANVAS.off("click").on("click", finalCoordinatesEvent);
    Instructions.showMessage("Choose another extremity point to define the region wherein to apply the algorithm.");
}

function finalCoordinatesEvent(event) {
    points.push(Canvas.getCoordinates(event));

    rangeX = points[0][0] <= points[1][0] ? [points[0][0], points[1][0]] : [points[1][0], points[0][0]]
    rangeY = points[0][1] <= points[1][1] ? [points[0][1], points[1][1]] : [points[1][1], points[0][1]]

    console.log(`rangeX: ${rangeX} | rangeY: ${rangeY}`);

    polygonEdges = Array(rangeY[1] - rangeY[0] - 1).fill(null).map(() => Array(0));

    console.log(polygonEdges);

    for (let y = rangeY[0] + 1; y < rangeY[1]; y++) {
        pointX = null;

        for (let x = rangeX[0] + 1; x < rangeX[1]; x++) {
            if (Canvas.isPainted([x, y], colors.RED)) {
                if (pointX === null || (x - pointX) === 1) pointX = x;
                else {
                    polygonEdges[y - rangeY[0] - 1].push(pointX - rangeX[0]);

                    pointX = x;

                    polygonEdges[y - rangeY[0] - 1].push(pointX - rangeX[0]);
                }
            }
        }

        if (
            polygonEdges[y - rangeY[0] - 1].length % 2 !== 0 &&
            pointX !== null &&
            Canvas.isPainted([pointX, y], colors.RED)
        ) polygonEdges[y - rangeY[0] - 1].push(pointX - rangeX[0]);

        for (let y = 0; y < polygonEdges.length; y++)
            for (let x = 0; x < polygonEdges[y].length; x++)
                Canvas.paintPixel([polygonEdges[y][x] + rangeX[0], y + rangeY[0] + 1], colors.BLUE);
    }
}