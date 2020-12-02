import * as Canvas from "../elements/Canvas.js";
import * as Instructions from "../elements/Instructions.js";

import * as colors from "../constants/colors.js";

let point;

export function initialize() {
    $(document).off("keypress");
    Canvas.CANVAS.off("click").on("click", positionEvent);
    Instructions.showMessage("Choose a POINT to fill.");
}

function positionEvent(event) {
    point = Canvas.getCoordinates(event);


    floodFill(point, colors.GREEN, colors.RED);
}

function floodFill(point, paintColor, edgeColor) {
    let pixelColor = Canvas.getColorPixel(point);

    let adjacency = [
        [point[0] + 1, point[1]],
        [point[0] - 1, point[1]],
        [point[0], point[1] - 1],
        [point[0], point[1] + 1],
    ]

    let notEdge    = pixelColor !== edgeColor;
    let notPainted = pixelColor !== paintColor;
    let positive   = point[0] >= 0 && point[1] >= 0;
    let inLimits   = point[0] < Canvas.VIRTUAL_WIDTH && point[1] < Canvas.VIRTUAL_HEIGHT;


    if (notEdge && notPainted && positive && inLimits) {
        Canvas.paintPixel(point, paintColor, true);

        for (let p = 0; p < adjacency.length; p++) floodFill(adjacency[p], paintColor, edgeColor);
    }
}
