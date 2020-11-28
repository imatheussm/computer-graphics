let canvas = document.getElementById("canvas");
let initialCoordinates, finalCoordinates, pixelSize;

const dpi     = window.devicePixelRatio;
const context = canvas.getContext("2d");

context.translate(0.5, 0.5);

function initializeCanvas() {
    if (typeof pixelSize === 'undefined') {
        pixelSize = 20;
    }

    drawPixelGrid(pixelSize);
}

function initializeButtons() {
    $( "#bresenham-button" ).on("click", activateBresenham);
    $( "#clear-button" ).on("click", initializeCanvas);
}

function activateBresenham() {
    $( "canvas" ).on("click", firstClick);

    //    canvas.addEventListener("click", firstClick);
}

function drawPixelGrid(pixelSize) {
    let height = canvas.offsetHeight * dpi;
    let width  = canvas.offsetWidth * dpi;


    canvas.setAttribute('height', height.toString());
    canvas.setAttribute('width', width.toString());

    context.fillStyle   = "#2b2b2b";
    context.strokeStyle = "#3c3c3c";

    for (let x = 0; x < width; x += pixelSize) {
        context.moveTo(x, 0);
        context.lineTo(x, height);
    }

    for (let y = 0; y < height; y += pixelSize) {
        context.moveTo(0, y);
        context.lineTo(width, y);
    }

    context.fillRect(0, 0, width, height);
    context.stroke();
}

function getCoordinates(event) {
    let rectangle = canvas.getBoundingClientRect();

    let x = event.clientX - rectangle.left;
    let y = event.clientY - rectangle.top;


    return [Math.floor(x / pixelSize), Math.floor(y / pixelSize)];
}

function paintSquare(x, y) {
    x *= pixelSize;
    y *= pixelSize;

    context.fillStyle="#ff0000";
    context.fillRect(x, y, pixelSize, pixelSize);
}

function firstClick(event) {
    initialCoordinates = getCoordinates(event);

    console.log(initialCoordinates);

    paintSquare(initialCoordinates[0], initialCoordinates[1]);

    $( "canvas" ).off("click");
    $( "canvas" ).on("click", secondClick);
}

function secondClick(event) {
    finalCoordinates = getCoordinates(event);

    drawLine();

    $( "canvas" ).off("click");
    $( "canvas" ).on("click", firstClick);
}

function drawLine() {
    let [x0, y0] = initialCoordinates;
    let [x1, y1] = finalCoordinates;

    let [deltaX, deltaY] = [Math.abs(x1 - x0), Math.abs(y1 - y0)];
    let [signalX, signalY] = [(x0 < x1 ? 1 : -1), (y0 < y1 ? 1 : -1)];

    let error = deltaX - deltaY;


    while(true) {
        if ((x0 === x1) && (y0 === y1)) break;

        let twoTimesError = 2 * error;

        if (twoTimesError > -deltaY) { error -= deltaY; x0 += signalX; }
        if (twoTimesError <  deltaX) { error += deltaX; y0 += signalY; }

        paintSquare(x0, y0);
    }
}

$( document ).on("DOMContentLoaded", initializeCanvas);
$( document ).on("DOMContentLoaded", initializeButtons);

$( window ).on("resize", initializeCanvas);
