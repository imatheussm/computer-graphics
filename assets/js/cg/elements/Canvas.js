import * as Instructions from "./Instructions.js";
import * as colors from "../constants/colors.js";
import * as ArrayMethods from "../utilities/array.js";

export const CANVAS  = $("#canvas");
export const CONTEXT = CANVAS[0].getContext("2d");
export const DPI     = window.devicePixelRatio;
export let virtualHeight, virtualWidth;

CONTEXT.translate(0.5, 0.5);

let realHeight, realWidth;
let pixelSize, pixelMatrix;

export let heightOffset = 4, widthOffset = 4;
let virtualPaintHeight, virtualPaintWidth;

export function initialize() {
    initializePixelMatrix();
    refresh()

    CANVAS.off("click").off("keypress").off("keyup");
    Instructions.showMessage("Select an algorithm to continue.");

}

export function refresh(size = null) {
    pixelSize = size || parseInt($("#density-slider").val());

    updateCanvasDimensions();
    drawPixelGrid();
    paintPixelGrid();
    drawTrimArea();
}

function initializePixelMatrix() {
    pixelMatrix = Array(virtualHeight).fill(null).map(() => Array(virtualWidth).fill(null));
}

function updateCanvasDimensions() {
    realHeight = CANVAS[0].offsetHeight * DPI;
    realWidth  = CANVAS[0].offsetWidth  * DPI;

    virtualHeight = Math.ceil(realHeight / pixelSize);
    virtualWidth  = Math.ceil(realWidth  / pixelSize);

    virtualPaintHeight = virtualHeight - 2 * heightOffset;
    virtualPaintWidth = virtualWidth - 2 * widthOffset;

    updatePixelMatrix();
}

function updatePixelMatrix() {
    let [pixelMatrixHeight, pixelMatrixWidth] = [pixelMatrix.length, pixelMatrix[0].length];

    while (pixelMatrixHeight > virtualHeight) {
        pixelMatrix.pop();

        pixelMatrixHeight = pixelMatrix.length;
    } while (pixelMatrixHeight < virtualHeight) {
        pixelMatrix.push(Array(pixelMatrixWidth).fill(null));

        pixelMatrixHeight = pixelMatrix.length;
    }

    while (pixelMatrixWidth > virtualWidth) {
        for (let i = 0; i < pixelMatrixHeight; i++) {
            pixelMatrix[i].pop();
        }

        pixelMatrixWidth = pixelMatrix[0].length;
    } while (pixelMatrixWidth < virtualWidth) {
        for (let i = 0; i < pixelMatrixHeight; i++) {
            pixelMatrix[i].push(null);
        }

        pixelMatrixWidth = pixelMatrix[0].length;
    }
}

export function drawPixelGrid() {
    CANVAS[0].setAttribute('height', realHeight.toString());
    CANVAS[0].setAttribute('width', realWidth.toString());

    CONTEXT.fillStyle   = colors.BLACK;
    CONTEXT.strokeStyle = "#3c3c3c";

    for (let x = 0; x < realWidth; x += pixelSize) {
        CONTEXT.moveTo(x, 0);
        CONTEXT.lineTo(x, realHeight);
    } for (let y = 0; y < realHeight; y += pixelSize) {
        CONTEXT.moveTo(0, y);
        CONTEXT.lineTo(realWidth, y);
    }

    CONTEXT.fillRect(0, 0, realWidth, realHeight);
    CONTEXT.stroke();
}

function paintPixelGrid() {
    for (let line = 0; line < pixelMatrix.length; line++) {
        for (let column = 0; column < pixelMatrix[0].length; column++) {
            if (pixelMatrix[line][column] != null) {
                paintPixel([column, line], pixelMatrix[line][column]);
            }
        }
    }
}

export function paintPixel(coordinates, color, isPermanent) {
    const [virtualX, virtualY] = coordinates;
    const [realX, realY] = virtualToReal(coordinates);

    CONTEXT.fillStyle = color;
    CONTEXT.fillRect(realX, realY, pixelSize, pixelSize);

    if (isPermanent === true && virtualX >= 0 && virtualY >= 0 &&
        virtualX < pixelMatrix[0].length && virtualY < pixelMatrix.length) {
        pixelMatrix[virtualY][virtualX] = color;
    }
}

export function getPixelColor(coordinates) {
    const [virtualX, virtualY] = coordinates;


    return pixelMatrix[virtualY, virtualX];
}

export function getCoordinates(event) {
    let rectangle = CANVAS[0].getBoundingClientRect();

    let x = event.clientX - rectangle.left;
    let y = event.clientY - rectangle.top;


    return [Math.floor(x / pixelSize), Math.floor(y / pixelSize)];
}

function componentToHex(color_value) {
  let hex = color_value.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(red, green, blue) {
    return "#" + componentToHex(red) + componentToHex(green) + componentToHex(blue);
}

function virtualToReal(coordinates){
    const [realX, realY] = coordinates.map(x => parseInt(x.toString()) * pixelSize);


    return [realX, realY];
}

export function getColorPixel(coordinates){
    const [realX, realY] = virtualToReal(coordinates);

    let imgData = CONTEXT.getImageData(realX, realY, 1, 1);

    let red = imgData.data[0];
    let green = imgData.data[1];
    let blue = imgData.data[2];


    return rgbToHex(red, green, blue);
}

function drawTrimArea() {
    for (let x = 0; x < virtualWidth; x++) {
        for (let y = 0; y < virtualHeight; y++) {
            let inWidth = (x < widthOffset) || ((virtualWidth - x) <= widthOffset)
            let inHeight = (y < heightOffset) || ((virtualHeight - y) <= heightOffset)
            if (inWidth || inHeight) {
                paintPixel([x, y], colors.DARK_BLUE);
            }
        }
    }
}

export function binCodePixel(coordinates){
    let [x, y] = coordinates;

    let firstBit = y < heightOffset;
    let secondBit = y > (virtualHeight - heightOffset - 1);
    let thirdBit = x > (virtualWidth - widthOffset - 1);
    let fourthBit = x < widthOffset;


    return [firstBit, secondBit, thirdBit, fourthBit];
}

export function isInPaintableArea(coordinates){
    return ArrayMethods.isArrayEqual(binCodePixel(coordinates), [false, false, false, false]);
}
