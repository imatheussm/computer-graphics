import * as Canvas from "../../elements/Canvas.js";
import * as Instructions from "../../elements/Instructions.js";

import * as colors from "../../constants/colors.js";

let currentPoint, pixelColor, upPosition, downPosition, leftPosition, rightPosition, notEdge, notPainted, positive,
    inLimits, queue;

export function initialize() {
    queue = [];


    Canvas.disableEvents();
    Canvas.CANVAS.on("click", positionEvent);
    Instructions.showMessage("Choose a POINT to fill.");
}

function positionEvent(event) {
    queue.push(Canvas.getCoordinates(event));
    floodFill();
}

function floodFill(paintColor = colors.GREEN, edgeColor = colors.RED) {
    while (queue.length > 0) {
        currentPoint = queue.shift();
        pixelColor = Canvas.getColorPixel(currentPoint);

        upPosition    = [currentPoint[0] + 1, currentPoint[1]];
        downPosition  = [currentPoint[0] - 1, currentPoint[1]];
        leftPosition  = [currentPoint[0], currentPoint[1] - 1];
        rightPosition = [currentPoint[0], currentPoint[1] + 1];

        notEdge    = (pixelColor !== edgeColor);
        notPainted = (pixelColor !== paintColor);
        positive   = (currentPoint[0] >= 0 && currentPoint[1] >= 0);
        inLimits   = (currentPoint[0] < Canvas.virtualWidth && currentPoint[1] < Canvas.virtualHeight);


        if (notEdge && notPainted && positive && inLimits) {
            Canvas.paintPixel(currentPoint, paintColor, true);

            queue.push(upPosition);
            queue.push(downPosition);
            queue.push(rightPosition);
            queue.push(leftPosition);
        }
    }

    Canvas.refresh();
}
