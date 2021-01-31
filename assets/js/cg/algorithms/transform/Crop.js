import * as Canvas from "../../elements/Canvas.js";
import * as Instructions from "../../elements/Instructions.js";
import * as colors from "../../constants/colors.js";
import * as Line from "../draw/Line.js";
import * as Util from "../../utilities/miscellaneous.js";

let topLeftPoint, bottomRightPoint;

export function initialize() {
    Canvas.CANVAS.off("click").on("click", topLeftEvent);
    Instructions.showMessage("Choose a point to define the TOP-LEFT border of the crop area.");
}

function topLeftEvent(event) {
    topLeftPoint = Canvas.getCoordinates(event);
    if (Canvas.getColorPixel(topLeftPoint) !== colors.RED) {
        Canvas.paintPixel(topLeftPoint, colors.DARK_BLUE, true);
    }

    Canvas.CANVAS.off("click").on("click", bottomRightEvent);
    Instructions.showMessage("Choose another point to define the BOTTOM-RIGHT border of the crop area.");
}

function bottomRightEvent(event) {
    bottomRightPoint = Canvas.getCoordinates(event);
    let toRight = bottomRightPoint[0] > topLeftPoint[0];
    let toBottom = bottomRightPoint[1] > topLeftPoint[1];
    if (toRight && toBottom) {

        if (Canvas.getColorPixel(bottomRightPoint) !== colors.RED) {
            Canvas.paintPixel(bottomRightPoint, colors.DARK_BLUE, true);
        }
        Canvas.CANVAS.off("click")
        draw();
        Canvas.refresh();
        Instructions.showMessage("Select an algorithm to continue.");
    }
}

function isInsideEdge(edgeLine, point, mode){
    if (mode === "left"){
        return point[0] >= edgeLine[0][0];
    } else if (mode === "right"){
        return point[0] <= edgeLine[0][0];
    } else if (mode === "bottom") {
        return point[1] <= edgeLine[0][1];
    } else if (mode === "top") {
        return point[1] >= edgeLine[0][1];
    }
}

function draw() {
    let polygonPoints = Line.visitedPoints

    let left = topLeftPoint[0] + 1;
    let top = topLeftPoint[1] + 1;
    let bottom = bottomRightPoint[1] - 1;
    let right = bottomRightPoint[0] - 1;


    let edgeLines = {
        "left": [[left, bottom], [left, top]],
        "right": [[right, top], [right, bottom]],
        "bottom": [[right, bottom], [left, bottom]],
        "top": [[left, top], [right, top]]
    };
    let originalPolygonPoints = polygonPoints.slice(0, polygonPoints.length);
    let newPolygonPoints = polygonPoints.slice(0, polygonPoints.length);
    for (let key in edgeLines){
        polygonPoints = newPolygonPoints.slice(0, newPolygonPoints.length);
        newPolygonPoints = [];

        let numPolygonPoints = polygonPoints.length;
        for (let pointIndex=0; pointIndex < numPolygonPoints; pointIndex++){
            let currentPoint = polygonPoints[pointIndex];
            let previousPoint = polygonPoints[(pointIndex + numPolygonPoints - 1) % numPolygonPoints];

            let intersectionPoint = Util.getIntersectionPoint(edgeLines[key], [previousPoint, currentPoint]);

            if (isInsideEdge(edgeLines[key], currentPoint, key)) {
                if (!isInsideEdge(edgeLines[key], previousPoint, key)){
                    newPolygonPoints.push(intersectionPoint);
                }
                newPolygonPoints.push(currentPoint);
            } else if (isInsideEdge(edgeLines[key], previousPoint, key)){
                newPolygonPoints.push(intersectionPoint);
            }
        }
    }

    //erase last polygon
    for (let i = 0; i < originalPolygonPoints.length; i++){
        Line.draw(
            originalPolygonPoints[i],
            originalPolygonPoints[(i + 1) % originalPolygonPoints.length], colors.BLACK
        );
    }

    //draw new polygon
    for (let i = 0; i < newPolygonPoints.length; i++){
        Line.draw(newPolygonPoints[i], newPolygonPoints[(i + 1) % newPolygonPoints.length]);
    }

    //draw border
    Line.draw([left-1, top-1] ,[right+1, top-1], colors.DARK_BLUE);
    Line.draw([right+1, top-1] ,[right+1, bottom+1], colors.DARK_BLUE);
    Line.draw([right+1, bottom+1] ,[left-1, bottom+1], colors.DARK_BLUE);
    Line.draw([left-1, bottom+1] ,[left-1, top-1], colors.DARK_BLUE);
}




