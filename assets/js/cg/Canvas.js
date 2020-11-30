import * as constants from "./constants.js";
import * as tools from "./tools.js";

export function initializer() {
    drawPixelGrid(constants.PIXEL_SIZE);
    constants.CANVAS.off("click").off("keypress").off("keyup");
    tools.showMessage("Select an algorithm to continue.");
}

function drawPixelGrid(pixelSize) {
    let height = constants.CANVAS[0].offsetHeight * constants.DPI;
    let width  = constants.CANVAS[0].offsetWidth * constants.DPI;


    constants.CANVAS[0].setAttribute('height', height.toString());
    constants.CANVAS[0].setAttribute('width', width.toString());

    constants.CONTEXT.fillStyle   = "#2b2b2b";
    constants.CONTEXT.strokeStyle = "#3c3c3c";

    for (let x = 0; x < width; x += pixelSize) {
        constants.CONTEXT.moveTo(x, 0);
        constants.CONTEXT.lineTo(x, height);
    }

    for (let y = 0; y < height; y += pixelSize) {
        constants.CONTEXT.moveTo(0, y);
        constants.CONTEXT.lineTo(width, y);
    }

    constants.CONTEXT.fillRect(0, 0, width, height);
    constants.CONTEXT.stroke();
}