import * as Canvas from "../elements/Canvas.js";
import * as Instructions from "../elements/Instructions.js";

import * as colors from "../constants/colors.js";

let point, visitedPoints;

export function initialize() {
    visitedPoints = Array(Canvas.VIRTUAL_HEIGHT).fill(null)
        .map(() => Array(Canvas.VIRTUAL_WIDTH).fill(null));

    $(document).off("keypress");
    Canvas.CANVAS.off("click").on("click", borderEvent);
    Instructions.showMessage("Choose a POINT of the BORDER of the object to fill.");
}

function borderEvent(event) {
    point = Canvas.getCoordinates(event);

    scanLine(point, colors.RED);

    for (let i = 0; i < visitedPoints.length; i++) {
        for (let j = 0; j < visitedPoints[0].length; j++) {
            if (visitedPoints[i][j] === true) {
                Canvas.paintPixel([j, i], colors.BLUE, true);
            }
        }
    }
}

function scanLine(point, edgeColor) {
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
    let notVisited = visitedPoints[point[1]][point[0]] === null;

    if (notVisited) {
        if (isEdge) {
            visitedPoints[point[1]][point[0]] = true;

            for (let p = 0; p < adjacency.length; p++) scanLine(adjacency[p], edgeColor);
        } else {
            visitedPoints[point[1]][point[0]] = false;
        }
    }
}