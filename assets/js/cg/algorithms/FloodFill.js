import * as Canvas from "../elements/Canvas.js";
import * as Instructions from "../elements/Instructions.js";

import * as colors from "../constants/Colors.js";

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

function floodFill(position, paintColor, edgeColor) {
    let pixelColor = Canvas.getColorPixel(position);

    let upPosition    = [position[0] + 1, position[1]];
    let downPosition  = [position[0] - 1, position[1]];
    let leftPosition  = [position[0], position[1] - 1];
    let rightPosition = [position[0], position[1] + 1];

    let notEdge    = (pixelColor !== edgeColor);
    let notPainted = (pixelColor !== paintColor);
    let positive   = (position[0] >= 0 && position[1] >= 0);
    let inLimits   = (position[0] < Canvas.VIRTUAL_WIDTH && position[1] < Canvas.VIRTUAL_HEIGHT);


    if (notEdge && notPainted && positive && inLimits) {
        Canvas.paintPixel(position, paintColor, true);

        floodFill(upPosition, paintColor, edgeColor);
        floodFill(downPosition, paintColor, edgeColor);
        floodFill(rightPosition, paintColor, edgeColor);
        floodFill(leftPosition, paintColor, edgeColor);
    }

    Canvas.refresh();
}
