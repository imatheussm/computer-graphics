import * as Instructions from "./Instructions.js";

export const CANVAS  = $("#canvas");
export const CONTEXT = CANVAS[0].getContext("2d");
export const DPI     = window.devicePixelRatio;
export let CANVAS_VIRTUAL_HEIGHT, CANVAS_VIRTUAL_WIDTH;

let CANVAS_REAL_HEIGHT, CANVAS_REAL_WIDTH
let PIXEL_SIZE, PIXEL_MATRIX;

CONTEXT.translate(0.5, 0.5);

export function initialize() {
    PIXEL_SIZE = PIXEL_SIZE || 20;

    initializePixelMatrix();

    updateCanvasDimensions();
    drawPixelGrid();

    CANVAS.off("click").off("keypress").off("keyup");
    Instructions.showMessage("Select an algorithm to continue.");
}

export function refresh() {
    updateCanvasDimensions();
    drawPixelGrid();
    paintPixelGrid();
}

function initializePixelMatrix() {
    PIXEL_MATRIX = Array(CANVAS_VIRTUAL_HEIGHT).fill(null).map(() => Array(CANVAS_VIRTUAL_WIDTH).fill(null));
}

function updateCanvasDimensions() {
    CANVAS_REAL_HEIGHT = CANVAS[0].offsetHeight * DPI;
    CANVAS_REAL_WIDTH  = CANVAS[0].offsetWidth  * DPI;

    CANVAS_VIRTUAL_HEIGHT = Math.ceil(CANVAS_REAL_HEIGHT / PIXEL_SIZE);
    CANVAS_VIRTUAL_WIDTH  = Math.ceil(CANVAS_REAL_WIDTH  / PIXEL_SIZE);

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
}

function drawPixelGrid() {
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

function paintPixelGrid() {
    for (let line = 0; line < PIXEL_MATRIX.length; line++) {
        for (let column = 0; column < PIXEL_MATRIX[0].length; column++) {
            if (PIXEL_MATRIX[line][column] != null) {
                paintPixel([column, line], PIXEL_MATRIX[line][column]);
            }
        }
    }
}

export function paintPixel(coordinates, color, isPermanent) {
    const [virtualX, virtualY] = coordinates;
    const [realX, realY] = virtualToReal(coordinates);

    CONTEXT.fillStyle = color;
    CONTEXT.fillRect(realX, realY, PIXEL_SIZE, PIXEL_SIZE);

    if (isPermanent === true && virtualX >= 0 && virtualY >= 0 &&
        virtualX < PIXEL_MATRIX[0].length && virtualY < PIXEL_MATRIX.length) {
        PIXEL_MATRIX[virtualY][virtualX] = color;
    }
}

export function getCoordinates(event) {
    let rectangle = CANVAS[0].getBoundingClientRect();

    let x = event.clientX - rectangle.left;
    let y = event.clientY - rectangle.top;


    return [Math.floor(x / PIXEL_SIZE), Math.floor(y / PIXEL_SIZE)];
}

function componentToHex(color_value) {
  var hex = color_value.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function virtualToReal(coordinates){
    const [realX, realY] = coordinates.map(x => parseInt(x.toString()) * PIXEL_SIZE);
    return [realX, realY];
}

export function getColorPixel(coordinates){
    const [realX, realY] = virtualToReal(coordinates);
    let imgData = CONTEXT.getImageData(realX,realY,1,1);
    let r = imgData.data[0];
    let g = imgData.data[1];
    let b = imgData.data[2];
    return rgbToHex(r,g,b);
}
