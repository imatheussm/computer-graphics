import * as Instructions from "./Instructions.js";
import * as colors from "../constants/colors.js";
import * as util from "../algorithms/ScanLine.js";

export const CANVAS  = $("#canvas");
export const CONTEXT = CANVAS[0].getContext("2d");
export const DPI     = window.devicePixelRatio;
export let VIRTUAL_HEIGHT, VIRTUAL_WIDTH;

let REAL_HEIGHT, REAL_WIDTH
let PIXEL_SIZE, PIXEL_MATRIX;

CONTEXT.translate(0.5, 0.5);

export let HEIGHT_OFFSET = 4;
export let WIDTH_OFFSET = 4;

let VIRTUAL_PAINT_HEIGHT;
let VIRTUAL_PAINT_WIDTH;


export function initialize() {
    PIXEL_SIZE = PIXEL_SIZE || 20;

    initializePixelMatrix();

    updateCanvasDimensions();
    drawPixelGrid();
    VIRTUAL_PAINT_HEIGHT = VIRTUAL_HEIGHT - 2 * HEIGHT_OFFSET;
    VIRTUAL_PAINT_WIDTH = VIRTUAL_WIDTH - 2 * WIDTH_OFFSET;
    draw_trim_area();

    CANVAS.off("click").off("keypress").off("keyup");
    Instructions.showMessage("Select an algorithm to continue.");

}

export function refresh() {
    updateCanvasDimensions();
    drawPixelGrid();
    paintPixelGrid();
}

function initializePixelMatrix() {
    PIXEL_MATRIX = Array(VIRTUAL_HEIGHT).fill(null).map(() => Array(VIRTUAL_WIDTH).fill(null));
}

function updateCanvasDimensions() {
    REAL_HEIGHT = CANVAS[0].offsetHeight * DPI;
    REAL_WIDTH  = CANVAS[0].offsetWidth  * DPI;

    VIRTUAL_HEIGHT = Math.ceil(REAL_HEIGHT / PIXEL_SIZE);
    VIRTUAL_WIDTH  = Math.ceil(REAL_WIDTH  / PIXEL_SIZE);

    updatePixelMatrix();
}

function updatePixelMatrix() {
    let [pixelMatrixHeight, pixelMatrixWidth] = [PIXEL_MATRIX.length, PIXEL_MATRIX[0].length];

    while (pixelMatrixHeight > VIRTUAL_HEIGHT) {
        PIXEL_MATRIX.pop();

        pixelMatrixHeight = PIXEL_MATRIX.length;
    } while (pixelMatrixHeight < VIRTUAL_HEIGHT) {
        PIXEL_MATRIX.push(Array(pixelMatrixWidth).fill(null));

        pixelMatrixHeight = PIXEL_MATRIX.length;
    }

    while (pixelMatrixWidth > VIRTUAL_WIDTH) {
        for (let i = 0; i < pixelMatrixHeight; i++) {
            PIXEL_MATRIX[i].pop();
        }

        pixelMatrixWidth = PIXEL_MATRIX[0].length;
    } while (pixelMatrixWidth < VIRTUAL_WIDTH) {
        for (let i = 0; i < pixelMatrixHeight; i++) {
            PIXEL_MATRIX[i].push(null);
        }

        pixelMatrixWidth = PIXEL_MATRIX[0].length;
    }
}

function drawPixelGrid() {
    CANVAS[0].setAttribute('height', REAL_HEIGHT.toString());
    CANVAS[0].setAttribute('width', REAL_WIDTH.toString());

    CONTEXT.fillStyle   = "#2b2b2b";
    CONTEXT.strokeStyle = "#3c3c3c";

    for (let x = 0; x < REAL_WIDTH; x += PIXEL_SIZE) {
        CONTEXT.moveTo(x, 0);
        CONTEXT.lineTo(x, REAL_HEIGHT);
    } for (let y = 0; y < REAL_HEIGHT; y += PIXEL_SIZE) {
        CONTEXT.moveTo(0, y);
        CONTEXT.lineTo(REAL_WIDTH, y);
    }

    CONTEXT.fillRect(0, 0, REAL_WIDTH, REAL_HEIGHT);
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

function draw_trim_area(){
    for (let x=0; x < VIRTUAL_WIDTH; x++){
        for (let y=0; y < VIRTUAL_HEIGHT; y++){
            let inWidth = (x < WIDTH_OFFSET) || ((VIRTUAL_WIDTH - x) <= WIDTH_OFFSET)
            let inHeight = (y < HEIGHT_OFFSET) || ((VIRTUAL_HEIGHT - y) <= HEIGHT_OFFSET)
            if (inWidth || inHeight) {
                paintPixel([x, y], colors.DARKBLUE, true);
            }
        }
    }
}

function customSign(x){
    return x < 0;
}


export function binCodePixel(coordinates){
    let x = coordinates[0];
    let y = coordinates[1];
    let firstBit = y < HEIGHT_OFFSET;
    let secondBit = y > (VIRTUAL_HEIGHT - HEIGHT_OFFSET - 1);
    let thirdBit = x > (VIRTUAL_WIDTH - WIDTH_OFFSET - 1);
    let fourthBit = x < WIDTH_OFFSET;
    return [firstBit, secondBit, thirdBit, fourthBit]
}

export function isInPaintableArea(coordinates){
    return util.isArrayEqual(binCodePixel(coordinates), [false, false, false, false]);
}

export function listAnd(list1, list2){
    let result = [];
    for (let i =0; i < list1.length; i++){
        result.push(list1[i] && list2[i]);
    }
    return result;
}

export function listOr(list1, list2){
    let result = [];
    for (let i =0; i < list1.length; i++){
        result.push(list1[i] || list2[i]);
    }
    return result;
}
