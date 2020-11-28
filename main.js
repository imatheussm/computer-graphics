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
    $( "#circle-button" ).on("click", Circle.initializeCircle);
    $( "#multi-line-button" ).on("click", MultiLine.initialize);
    $( "#clear-button" ).on("click", initializeCanvas);
}

function activateBresenham() {
    $( "canvas" ).on("click", firstClick);
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


class Circle {
    center = [0, 0];
    radius = 0;

    static centerEvent(event){
        var circle_center = getCoordinates(event);
        Circle.center = circle_center;
        paintSquare(circle_center[0], circle_center[1]);
        $( "canvas" ).off("click");
        $( "canvas" ).on("click", Circle.radiusEvent);
    }

    static radiusEvent(event){
        var border = getCoordinates(event);
        var x_dist = Math.pow(Circle.center[0] - border[0], 2);
        var y_dist = Math.pow(Circle.center[1] - border[1], 2);
        Circle.radius = parseInt(Math.sqrt(x_dist + y_dist));
        $( "canvas" ).off("click");
        Circle.draw();
    }

    static drawEight(x, y){
        paintSquare(x + Circle.center[0], y + Circle.center[1]);
        paintSquare(y + Circle.center[0], x + Circle.center[1]);
        paintSquare(y + Circle.center[0], -x + Circle.center[1]);
        paintSquare(x + Circle.center[0], -y + Circle.center[1]);
        paintSquare(-x + Circle.center[0], -y + Circle.center[1]);
        paintSquare(-y + Circle.center[0], -x + Circle.center[1]);
        paintSquare(-y + Circle.center[0], x + Circle.center[1]);
        paintSquare(-x + Circle.center[0], y + Circle.center[1]);
    }

    static draw(){
        var x = Circle.radius;
        var y = 0;
        var error = 1-x;
        while (x >= y){
            Circle.drawEight(x, y);
            y++;

            if (error < 0) {
                error += 2 * y + 1;
             }
            else {
                x--;
                error += 2 * (y - x + 1);
            }
        }

    }

    static initializeCircle() {
        $( "canvas" ).off("click");
        $( "canvas" ).on("click", Circle.centerEvent);
    }  
}

class MultiLine {
    static points = new Array();

    static pointsEvent(event){
        var point = getCoordinates(event);
        paintSquare(point[0], point[1]);
        MultiLine.points.push(point);
    }

    static enterKeyEvent(event){
        if (event.which == 13){
            MultiLine.draw();
            $ ("canvas").off("click");
            $ (document).off('keypress');
        }
    }

    static draw(){
        var num_points = MultiLine.points.length;
        console.log(num_points);
        for (var i = 0; i < num_points - 1; i++){
            initialCoordinates = MultiLine.points[i];
            console.log(initialCoordinates);
            finalCoordinates = MultiLine.points[i+1];
            drawLine();
        }
        MultiLine.points = [];

    }

    static initialize() {
        $( "canvas" ).off("click");
        $( "canvas" ).on("click", MultiLine.pointsEvent);
        $(document).on("keypress", MultiLine.enterKeyEvent);
    }  
}

$( document ).on("DOMContentLoaded", initializeCanvas);
$( document ).on("DOMContentLoaded", initializeButtons);
$( window ).on("resize", initializeCanvas);
