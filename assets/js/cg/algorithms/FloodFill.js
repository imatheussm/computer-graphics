import * as Instructions from "../elements/Instructions.js";
import * as colors from "../constants/colors.js";
import * as Canvas from "../elements/Canvas.js";


let point, pixelColor;
let upPosition, downPosition, leftPosition, rightPosition;
let notEdge, notPainted, positive, inLimits;

export function initialize() {
    $(document).off("keypress");
    Canvas.CANVAS.off("click").on("click", positionEvent);
    Instructions.showMessage("Choose a point to fill.");
}

function positionEvent(event) {
    point = Canvas.getCoordinates(event);


    floodFill(point, colors.GREEN, colors.RED);
}

function floodFill(position, paintColor, edgeColor) {
    pixelColor = Canvas.getColorPixel(position);
    
    upPosition    = [position[0] + 1, position[1]];
    downPosition  = [position[0] - 1, position[1]];
    leftPosition  = [position[0], position[1] - 1];
    rightPosition = [position[0], position[1] + 1];

    notEdge    = (pixelColor !== edgeColor);
    notPainted = (pixelColor !== paintColor);
    positive   = (position[0] >= 0 && position[1] >= 0);
    inLimits   = (position[0] < Canvas.VIRTUAL_WIDTH && position[1] < Canvas.VIRTUAL_HEIGHT);


    if (notEdge && notPainted && positive && inLimits) {
        Canvas.paintPixel(position, paintColor, true);

        floodFill(upPosition, paintColor, edgeColor);
        floodFill(downPosition, paintColor, edgeColor);
        floodFill(rightPosition, paintColor, edgeColor);
        floodFill(leftPosition, paintColor, edgeColor);
    }
}
