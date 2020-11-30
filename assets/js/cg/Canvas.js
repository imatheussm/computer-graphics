import * as globals from "./globals.js";
import * as tools from "./tools.js";

export function initializer() {
    globals.CONTEXT.translate(0.5, 0.5);

    if (typeof globals.PIXEL_SIZE == "undefined") {
        globals.setPixelSize(20);
    }

    globals.updateCanvasDimensions();
    drawPixelGrid();

    globals.CANVAS.off("click").off("keypress").off("keyup");
    tools.showMessage("Select an algorithm to continue.");
}

function drawPixelGrid() {
    globals.CANVAS[0].setAttribute('height', globals.CANVAS_REAL_HEIGHT.toString());
    globals.CANVAS[0].setAttribute('width', globals.CANVAS_REAL_WIDTH.toString());

    globals.CONTEXT.fillStyle   = "#2b2b2b";
    globals.CONTEXT.strokeStyle = "#3c3c3c";

    for (let x = 0; x < globals.CANVAS_REAL_WIDTH; x += globals.PIXEL_SIZE) {
        globals.CONTEXT.moveTo(x, 0);
        globals.CONTEXT.lineTo(x, globals.CANVAS_REAL_HEIGHT);
    } for (let y = 0; y < globals.CANVAS_REAL_HEIGHT; y += globals.PIXEL_SIZE) {
        globals.CONTEXT.moveTo(0, y);
        globals.CONTEXT.lineTo(globals.CANVAS_REAL_WIDTH, y);
    }

    globals.CONTEXT.fillRect(0, 0, globals.CANVAS_REAL_WIDTH, globals.CANVAS_REAL_HEIGHT);
    globals.CONTEXT.stroke();
}

export function paintPixelGrid() {
    
}

export function paintPixel(coordinates, color="#ff0000") {
    let context = $("#canvas")[0].getContext("2d");

    coordinates = coordinates.map(x => x * globals.PIXEL_SIZE)

    context.fillStyle = color;
    context.fillRect(coordinates[0], coordinates[1], globals.PIXEL_SIZE, globals.PIXEL_SIZE);
}