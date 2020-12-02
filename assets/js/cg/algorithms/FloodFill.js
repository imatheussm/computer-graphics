import * as Instructions from "../elements/Instructions.js";
import * as colors from "../constants/colors.js";
import * as Canvas from "../elements/Canvas.js";


export function initialize() {
    Canvas.CANVAS.off("click").on("click", positionEvent);
    Instructions.showMessage("Choose a point to fill.");
}

function positionEvent(event) {
    let point = Canvas.getCoordinates(event);
    floodFill(point, colors.GREEN, colors.RED);
}

function floodFill(position, paintColor, edgeColor){ 
    let pixelColor = Canvas.getColorPixel(position);
    
    let up_position = [position[0]+1, position[1]];
    let down_position = [position[0]-1, position[1]];
    let right_position = [position[0], position[1]+1];
    let left_position = [position[0], position[1]-1];
    
    let notEdge = (pixelColor != edgeColor);
    let notPainted = (pixelColor != paintColor);
    let positive = (position[0] >= 0 && position[1] >= 0);
    let inLimits = (position[0] < Canvas.CANVAS_VIRTUAL_WIDTH && position[1] < Canvas.CANVAS_VIRTUAL_HEIGHT);
    
    if (notEdge && notPainted && positive && inLimits){
        Canvas.paintPixel(position, paintColor, true);
        floodFill(up_position, paintColor, edgeColor);
        floodFill(down_position, paintColor, edgeColor);
        floodFill(right_position, paintColor, edgeColor);
        floodFill(left_position, paintColor, edgeColor);
    }
}
