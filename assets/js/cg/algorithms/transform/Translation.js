import * as Canvas from "../../elements/Canvas.js";
import * as Instructions from "../../elements/Instructions.js";
import * as Array from "../../utilities/array.js";
import * as colors from "../../constants/colors.js";

let point, currentPoint, visitedPoints, queue, pixelColor, adjacency, isEdge, notVisited;

export function initialize() {
    visitedPoints = [];
    queue = [];

    $(document).off("keypress");
    Canvas.CANVAS.off("click").on("click", borderEvent);
    Instructions.showMessage("Click on the point of an object.");
}

function borderEvent(event) {
    point = Canvas.getCoordinates(event);

    if (Canvas.getPixelColor(point) !== null) {
        getPolygonPoints(point, colors.RED);
        Canvas.paintPixel(point, colors.BLUE, false);
        Instructions.showMessage("Click on a new point to translate the object.");
        Canvas.CANVAS.off("click").on("click", newPointEvent);
    }
}


function newPointEvent(event) {
    point = Canvas.getCoordinates(event);

    let [x0, y0] = visitedPoints[0];
    let [x1, y1] = point;
    let [diffX, diffY] = [(x1 - x0), (y1 - y0)];

    let newPoints = arrayScalarSum(visitedPoints, diffX, 0);
    newPoints = arrayScalarSum(newPoints, diffY, 1);

    //erase previous points
    for (let i = 0; i < visitedPoints.length; i++) {
        Canvas.erasePixel(visitedPoints[i]);
    }

    // paint new points
    for (let i = 0; i <newPoints.length; i++) {
        Canvas.paintPixel(newPoints[i], colors.RED, true);
    }

    Canvas.refresh();
    initialize();
}

function arrayScalarSum(array, scalar, index) {
    let result = [];

    for (let i = 0; i < array.length; i++) {
        let new_point = [array[i][0], array[i][1]];
        new_point[index] += scalar;

        result.push(new_point);
    }
    return result;
}

function getPolygonPoints(point, edgeColor) {
    queue.push(point);

    while (queue.length > 0) {
        currentPoint = queue.shift();

        pixelColor = Canvas.getColorPixel(currentPoint);

        adjacency = [
            [currentPoint[0] + 1, currentPoint[1] + 1],
            [currentPoint[0] + 1, currentPoint[1] + 0],
            [currentPoint[0] + 1, currentPoint[1] - 1],
            [currentPoint[0] + 0, currentPoint[1] + 1],
            [currentPoint[0] + 0, currentPoint[1] + 0],
            [currentPoint[0] + 0, currentPoint[1] - 1],
            [currentPoint[0] - 1, currentPoint[1] + 1],
            [currentPoint[0] - 1, currentPoint[1] + 0],
            [currentPoint[0] - 1, currentPoint[1] - 1],
        ]

        isEdge = pixelColor === edgeColor;
        notVisited = Array.includesArray(visitedPoints, currentPoint) === false;

        if (notVisited && isEdge) {
            visitedPoints.push(currentPoint);

            for (let i = 0; i < adjacency.length; i++) queue.push(adjacency[i]);
        }
    }
}