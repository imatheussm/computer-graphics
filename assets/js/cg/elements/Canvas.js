import * as Instructions from "./Instructions.js";

export const CANVAS  = $("#canvas");
export const CONTEXT = CANVAS[0].getContext("2d");
export const DPI     = window.devicePixelRatio;

export var CANVAS_REAL_HEIGHT, CANVAS_REAL_WIDTH, CANVAS_VIRTUAL_HEIGHT, CANVAS_VIRTUAL_WIDTH;
export var PIXEL_SIZE, PIXEL_MATRIX;

CONTEXT.translate(0.5, 0.5);

export function initialize() {
    PIXEL_SIZE = PIXEL_SIZE || 20;

    initializePixelMatrix();
    updateCanvasDimensions();
    drawPixelGrid();

    CANVAS.off("click").off("keypress").off("keyup");
    Instructions.showMessage("Select an algorithm to continue.");
}

function initializePixelMatrix() {
    PIXEL_MATRIX = Array(CANVAS_VIRTUAL_HEIGHT).fill(null).map(() => Array(CANVAS_VIRTUAL_WIDTH).fill(null));
}

export function updateCanvasDimensions() {
    console.log(`DPI: ${DPI}`);

    CANVAS_REAL_HEIGHT    = CANVAS[0].offsetHeight * DPI;
    CANVAS_REAL_WIDTH     = CANVAS[0].offsetWidth  * DPI;

    console.log(`CANVAS_REAL_HEIGHT: ${CANVAS_REAL_HEIGHT}`);
    console.log(`CANVAS_REAL_WIDTH: ${CANVAS_REAL_WIDTH}`);

    console.log(`PIXEL_SIZE: ${PIXEL_SIZE}`);

    CANVAS_VIRTUAL_HEIGHT = Math.ceil(CANVAS_REAL_HEIGHT / PIXEL_SIZE);
    CANVAS_VIRTUAL_WIDTH  = Math.ceil(CANVAS_REAL_WIDTH  / PIXEL_SIZE);

    console.log(`CANVAS_VIRTUAL_HEIGHT: ${CANVAS_VIRTUAL_HEIGHT}`);
    console.log(`CANVAS_VIRTUAL_WIDTH: ${CANVAS_VIRTUAL_WIDTH}`);

    updatePixelMatrix();
}

function updatePixelMatrix() {
    let [pixelMatrixHeight, pixelMatrixWidth] = [PIXEL_MATRIX.length, PIXEL_MATRIX[0].length];

    while (pixelMatrixHeight > CANVAS_VIRTUAL_HEIGHT) {
        PIXEL_MATRIX.pop();

        pixelMatrixHeight = PIXEL_MATRIX.length;
    } while (pixelMatrixHeight < CANVAS_VIRTUAL_HEIGHT) {
        PIXEL_MATRIX.push(Array(pixelMatrixWidth).fill(null));

        pixelMatrixHeight = PIXEL_MATRIX.length;
    }

    while (pixelMatrixWidth > CANVAS_VIRTUAL_WIDTH) {
        for (let i = 0; i < pixelMatrixHeight; i++) {
            PIXEL_MATRIX[i].pop();
        }

        pixelMatrixWidth = PIXEL_MATRIX[0].length;
    } while (pixelMatrixWidth < CANVAS_VIRTUAL_WIDTH) {
        for (let i = 0; i < pixelMatrixHeight; i++) {
            PIXEL_MATRIX[i].push(null);
        }

        pixelMatrixWidth = PIXEL_MATRIX[0].length;
    }

    console.log(`PIXEL_MATRIX: [${PIXEL_MATRIX.length}, ${PIXEL_MATRIX[0].length}]`);
}

export function drawPixelGrid() {
    CANVAS[0].setAttribute('height', CANVAS_REAL_HEIGHT.toString());
    CANVAS[0].setAttribute('width', CANVAS_REAL_WIDTH.toString());

    CONTEXT.fillStyle   = "#2b2b2b";
    CONTEXT.strokeStyle = "#3c3c3c";

    for (let x = 0; x < CANVAS_REAL_WIDTH; x += PIXEL_SIZE) {
        CONTEXT.moveTo(x, 0);
        CONTEXT.lineTo(x, CANVAS_REAL_HEIGHT);
    } for (let y = 0; y < CANVAS_REAL_HEIGHT; y += PIXEL_SIZE) {
        CONTEXT.moveTo(0, y);
        CONTEXT.lineTo(CANVAS_REAL_WIDTH, y);
    }

    CONTEXT.fillRect(0, 0, CANVAS_REAL_WIDTH, CANVAS_REAL_HEIGHT);
    CONTEXT.stroke();
}

export function paintPixelGrid() {
    for (let line = 0; line < PIXEL_MATRIX.length; line++) {
        for (let column = 0; column < PIXEL_MATRIX[0].length; column++) {
            if (PIXEL_MATRIX[line][column] != null) {
                paintPixel(line, column, PIXEL_MATRIX[line][column]);
            }
        }
    }
}

export function paintPixel(coordinates, color="#ff0000") {
    coordinates = coordinates.map(x => parseInt(x.toString()) * PIXEL_SIZE);

    CONTEXT.fillStyle = color;
    CONTEXT.fillRect(coordinates[0], coordinates[1], PIXEL_SIZE, PIXEL_SIZE);
}

export function getCoordinates(event) {
    let rectangle = $("#canvas")[0].getBoundingClientRect();

    let x = event.clientX - rectangle.left;
    let y = event.clientY - rectangle.top;


    return [Math.floor(x / PIXEL_SIZE), Math.floor(y / PIXEL_SIZE)];
}