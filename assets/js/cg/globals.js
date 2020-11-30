export const [CANVAS, INSTRUCTIONS] = [$("#canvas"), $("#instructions")];
export const CONTEXT                = CANVAS[0].getContext("2d");
export const DPI                    = window.devicePixelRatio;

export var CANVAS_REAL_HEIGHT, CANVAS_REAL_WIDTH, CANVAS_VIRTUAL_HEIGHT, CANVAS_VIRTUAL_WIDTH;
export var PIXEL_SIZE, PIXEL_MATRIX;


export const BLUE = "#0099cc";

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
    if (typeof PIXEL_MATRIX === "undefined") {
        PIXEL_MATRIX = Array(CANVAS_VIRTUAL_HEIGHT).fill(null)
            .map(() => Array(CANVAS_VIRTUAL_WIDTH).fill(null));

        console.log(`PIXEL_MATRIX: [${PIXEL_MATRIX.length}, ${PIXEL_MATRIX[0].length}]`);
    } else {
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
}

export function setPixelSize(newPixelSize) {
    PIXEL_SIZE = newPixelSize;
}