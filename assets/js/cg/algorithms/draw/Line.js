import * as Canvas from "../../elements/Canvas.js";
import * as Instructions from "../../elements/Instructions.js";
import * as Array from "../../utilities/array.js";
import * as colors from "../../constants/colors.js";
import * as Util from "../../utilities/miscellaneous.js";


let point, newPoint, x0, x1, y0, y1, deltaX, deltaY, signalX, signalY, error, twoTimesError;
export let visitedPoints;

export function initialize() {
    point = null;
    visitedPoints = [];

    Canvas.CANVAS.off("click").on("click", handleClick);
    $(document).off("keypress").off("keyup").on("keyup", handleKeyUp);
    Instructions.showMessage("Choose at least 2 points to draw lines on the screen. Press ENTER to end a polyline.");
}

function handleClick(event) {
    if (point == null) {
        point = Canvas.getCoordinates(event);


        Canvas.paintPixel(point, colors.BLUE);

    } else {
        Canvas.paintPixel(point, colors.RED, true);

        newPoint = Canvas.getCoordinates(event);


        cohenSutherland(point, newPoint);

        if (point != null) {
            visitedPoints.push(point);
            point = newPoint;
        }

        Canvas.paintPixel(newPoint, colors.BLUE);
    }
}

function cohenSutherland(pointA, pointB){
    let binCodePointA = Canvas.binCodePixel(pointA);
    let binCodePointB = Canvas.binCodePixel(pointB);
    let or = Array.arrayOr(binCodePointA, binCodePointB);
    let and = Array.arrayAnd(binCodePointA, binCodePointB);
    let allFalse = [false, false, false, false]


    if (Array.isArrayEqual(or, allFalse)) {
        draw(pointA, pointB);
        Canvas.refresh();
    } else if (Array.anyDifference(and, allFalse)) {
        Canvas.refresh();
        initialize();
    } else {
        let firstBitDifference = getFirstBitDifference(binCodePointA,
                                                       binCodePointB);
        let borderLine = getBorderLine(firstBitDifference);
        let intersectionPoint = Util.getIntersectionPoint(borderLine, [pointA,
                                                                          pointB])
        if (Canvas.isInPaintableArea(intersectionPoint)) {
            Canvas.paintPixel(intersectionPoint, colors.RED, true);
        }
        if (binCodePointA[firstBitDifference-1] === false) {
            cohenSutherland(pointA, intersectionPoint);
        } else {
            cohenSutherland(intersectionPoint, pointB);
        }

    }
}

function getBorderLine(diffBit) {
    if (diffBit === 1) {
        return [
            [Canvas.widthOffset,                          Canvas.heightOffset],
            [Canvas.virtualWidth - Canvas.widthOffset-1, Canvas.heightOffset]
        ];
    } else if (diffBit === 2) {
        return [
            [Canvas.widthOffset,                            Canvas.virtualHeight - Canvas.heightOffset - 1],
            [Canvas.virtualWidth - Canvas.widthOffset - 1, Canvas.virtualHeight - Canvas.heightOffset - 1]
        ];
    } else if (diffBit === 3) {
        return [
            [Canvas.virtualWidth - Canvas.widthOffset - 1, Canvas.heightOffset                        ],
            [Canvas.virtualWidth - Canvas.widthOffset - 1, Canvas.virtualHeight - Canvas.heightOffset]
        ];
    } else if (diffBit === 4) {
        return [
            [Canvas.widthOffset, Canvas.heightOffset                            ],
            [Canvas.widthOffset, Canvas.virtualHeight - Canvas.heightOffset - 1]
        ];
    }
}


function getFirstBitDifference(list1, list2){
    for (let i = 0; i < list1.length; i++) if (list1[i] || list2[i]) return i + 1;

    return false;
}

function handleKeyUp(event) {
    if (event.keyCode === 13) point = null;
    Canvas.refresh();
}

export function draw(initialCoordinates, finalCoordinates, color = colors.RED) {
    [x0, y0] = initialCoordinates.map(c => parseInt(c));
    [x1, y1] = finalCoordinates.map(c => parseInt(c));

    [deltaX, deltaY] = [Math.abs(x1 - x0), Math.abs(y1 - y0)];
    [signalX, signalY] = [(x0 < x1 ? 1 : -1), (y0 < y1 ? 1 : -1)];

    error = deltaX - deltaY;


    while(true) {
        if ((x0 === x1) && (y0 === y1)) break;

        twoTimesError = 2 * error;

        if (twoTimesError > -deltaY) { error -= deltaY; x0 += signalX; }
        if (twoTimesError <  deltaX) { error += deltaX; y0 += signalY; }

        Canvas.paintPixel([x0, y0], color, true);
    }
}
