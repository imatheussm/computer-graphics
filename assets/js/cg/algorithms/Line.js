import * as Canvas from "../elements/Canvas.js";
import * as Instructions from "../elements/Instructions.js";

import * as colors from "../constants/Colors.js";
import * as util from "./ScanLine.js";
import {
    HEIGHT_OFFSET, paintPixel,
    VIRTUAL_HEIGHT,
    VIRTUAL_WIDTH
} from "../elements/Canvas.js";


let point, x0, x1, y0, y1, deltaX, deltaY, signalX, signalY, error, twoTimesError;

export function initialize() {
    point = null;

    Canvas.CANVAS.off("click").on("click", handleClick);
    $(document).off("keypress").off("keyup").on("keyup", handleKeyUp);
    Instructions.showMessage("Choose at least 2 points to draw lines on the screen. Press ENTER to end a polyline.");
}

function handleClick(event) {
    if (point == null) {
        point = Canvas.getCoordinates(event);
        if (Canvas.isInPaintableArea(point)) {
            Canvas.paintPixel(point, colors.RED, true);
        } else {
            Canvas.paintPixel(point, colors.BLUE, false);
        }

    } else {
        const newPoint = Canvas.getCoordinates(event);
        cohenSutherland(point, newPoint);
        if (point != null){
            point = newPoint;
        }


    }
}

function cohenSutherland(pointA, pointB){
    let binCodePointA = Canvas.binCodePixel(pointA);
    console.log(binCodePointA);
    let binCodePointB = Canvas.binCodePixel(pointB);
    let or = Canvas.listOr(binCodePointA, binCodePointB);
    let and = Canvas.listAnd(binCodePointA, binCodePointB);
    let allFalse = [false, false, false, false]
    if (util.isArrayEqual(or, allFalse)){
        draw(pointA, pointB);
        Canvas.refresh();
    } else if (anyDifference(and, allFalse)) {
        Canvas.refresh();
        initialize();
    } else {
        let firstBitDifference = getFirstBitDifference(binCodePointA,
                                                       binCodePointB);
        let borderLine = getBorderLine(firstBitDifference);
        let intersectionPoint = getIntersectionPoint(borderLine, [pointA,
                                                                          pointB])
        if (Canvas.isInPaintableArea(intersectionPoint)) {
            paintPixel(intersectionPoint, colors.RED, true);
        }
        if (binCodePointA[firstBitDifference-1] === false) {
            cohenSutherland(pointA, intersectionPoint);
        } else {
            cohenSutherland(intersectionPoint, pointB);
        }

    }
}




function getIntersectionPoint(borderLine, realLine){
    let x1 = realLine[0][0];
    let x2 = realLine[1][0];
    let y1 = realLine[0][1];
    let y2 = realLine[1][1];
    let xi, yi;

    if (borderLine[0][0] === borderLine[1][0]) {
        xi = borderLine[0][0];

        yi = (xi - x1)*(y2-y1)/(x2-x1) + y1;
    } else if (borderLine[0][1] === borderLine[1][1]){
        yi = borderLine[0][1];
        xi = (yi - y1)*(x2-x1)/(y2-y1) + x1;
    }
    return [Math.round(xi), Math.round(yi)];
}

function getBorderLine(diffBit){
    if (diffBit === 1){
        return [[Canvas.WIDTH_OFFSET, Canvas.HEIGHT_OFFSET],
            [Canvas.VIRTUAL_WIDTH-Canvas.WIDTH_OFFSET-1, Canvas.HEIGHT_OFFSET]];
    } else if (diffBit === 2){
        return [[Canvas.WIDTH_OFFSET, Canvas.VIRTUAL_HEIGHT - Canvas.HEIGHT_OFFSET-1],
        [Canvas.VIRTUAL_WIDTH-Canvas.WIDTH_OFFSET-1, Canvas.VIRTUAL_HEIGHT - Canvas.HEIGHT_OFFSET-1]];
    } else if (diffBit === 3){
        return [[Canvas.VIRTUAL_WIDTH - Canvas.WIDTH_OFFSET-1, Canvas.HEIGHT_OFFSET],
        [Canvas.VIRTUAL_WIDTH - Canvas.WIDTH_OFFSET-1, Canvas.VIRTUAL_HEIGHT - Canvas.HEIGHT_OFFSET]];
    } else if (diffBit === 4){
        return [[Canvas.WIDTH_OFFSET, Canvas.HEIGHT_OFFSET],
            [Canvas.WIDTH_OFFSET, Canvas.VIRTUAL_HEIGHT - Canvas.HEIGHT_OFFSET-1]];
    }
}


function getFirstBitDifference(list1, list2){
    for (let i=0; i<list1.length; i++) {
        if (list1[i] || list2[i]) {
            return i + 1;
        }
    }
    return false;
}

function anyDifference(list1, list2){
    for (let i =0; i<list1.length; i++){
        if (list1[i] !== list2[i]){
            return true;
        }
    }
    return false;
}

function handleKeyUp(event) {
    if (event.keyCode === 13) point = null;
}

export function draw(initialCoordinates, finalCoordinates) {
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

        Canvas.paintPixel([x0, y0], colors.RED, true);
    }
}
