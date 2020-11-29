let [canvas, instructions] = [$("#canvas"), $("#instructions")];
let initialCoordinates, finalCoordinates, pixelSize;

const dpi     = window.devicePixelRatio;
const context = canvas[0].getContext("2d");

context.translate(0.5, 0.5);

function resetInstructions(){
    instructions.innerHTML = "Choose an option.";
    instructions.css("visibility", "hidden");
}


function initializeCanvas() {
    resetInstructions();
    if (typeof pixelSize === 'undefined') {
        pixelSize = 20;
    }

    drawPixelGrid(pixelSize);
}

function initializeButtons() {
    $( "#bresenham-button" ).on("click", activateBresenham);
    $( "#circle-button" ).on("click", Circle.initializeCircle);
    $( "#curve-button" ).on("click", Curve.initialize);
    $( "#multi-line-button" ).on("click", MultiLine.initialize);
    $( "#clear-button" ).on("click", initializeCanvas);
}

function activateBresenham() {
    instructions.innerHTML = "Choose two points to draw a line.";
    instructions.css("visibility", "visible");

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

function paintSquare(x, y, color="#ff0000") {
    x *= pixelSize;
    y *= pixelSize;

    context.fillStyle=color;
    context.fillRect(x, y, pixelSize, pixelSize);
}

function firstClick(event) {
    initialCoordinates = getCoordinates(event);

    paintSquare(initialCoordinates[0], initialCoordinates[1]);

    canvas.off("click");
    canvas.on("click", secondClick);
}

function secondClick(event) {
    finalCoordinates = getCoordinates(event);

    drawLine();

    canvas.off("click");
    canvas.on("click", firstClick);
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

    static showCenterMessage(){
        instructions.innerHTML = "Choose a point to define the CENTER of the circle.";
        instructions.css("visibility", "visible");
    }

    static centerEvent(event){
        instructions.innerHTML = "Choose another point to define the RADIUS of the circle.";
        instructions.css("visibility", "visible");

        var circle_center = getCoordinates(event);
        Circle.center = circle_center;
        paintSquare(circle_center[0], circle_center[1]);

        canvas.off("click");
        canvas.on("click", Circle.radiusEvent);
    }

    static radiusEvent(event){
        Circle.showCenterMessage();
        var border = getCoordinates(event);
        var x_dist = Math.pow(Circle.center[0] - border[0], 2);
        var y_dist = Math.pow(Circle.center[1] - border[1], 2);
        Circle.radius = parseInt(Math.sqrt(x_dist + y_dist));

        canvas.off("click");
        canvas.on("click", Circle.centerEvent);

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
        Circle.showCenterMessage();

        canvas.off("click");
        canvas.on("click", Circle.centerEvent);
    }  
}

class Curve {

    static num_lines = 3;
    static control_points = [];
    static initial_point = [0, 0];
    static final_point = [0, 0];
    static points_to_draw = [];

    static resetInstructions(event){
        document.getElementById("instructions").innerHTML = "Choose INITIAL point of the curve.";

    }

    static controlPointsEvent(event){
        var point = getCoordinates(event);
        paintSquare(point[0], point[1]);
        MultiLine.points.push(point);
    }

    static initialPointEvent(event){
        document.getElementById("instructions").innerHTML = "Choose FINAL point of the curve.";
        var point = getCoordinates(event);
        paintSquare(point[0], point[1]);
        Curve.initial_point = point;
        Curve.control_points.push(point);
        Curve.points_to_draw.push(point);
        $( "canvas" ).off("click");
        $( "canvas" ).on("click", Curve.finalPointEvent);
    }

    static finalPointEvent(event){
        document.getElementById("instructions").innerHTML = "Press ENTER to draw the curve.";
        var point = getCoordinates(event);
        paintSquare(point[0], point[1]);
        Curve.final_point = point;
        Curve.control_points.push(point);
        Curve.points_to_draw.push(point);
        $( "canvas" ).off("click");
        $(document).on("keypress", Curve.enterKeyEvent);

    }
    
    static enterKeyEvent(event){
        if (event.which == 13){
            Curve.draw();
        }
        Curve.initialize();
    }

    static belzierPoint(){

    }

    static draw(){
        var num_points = Curve.points_to_draw.length;
        for (var i = 0; i < num_points - 1; i++){
            initialCoordinates = Curve.points_to_draw[i];
            finalCoordinates = Curve.points_to_draw[i+1];
            drawLine();
        }
        Curve.points_to_draw = [];

    }

    static initialize() {
        Curve.resetInstructions();
        $( "canvas" ).off("click");
        $( "canvas" ).on("click", Curve.initialPointEvent);
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
        }
    }

    static draw(){
        var num_points = MultiLine.points.length;
        for (var i = 0; i < num_points - 1; i++){
            initialCoordinates = MultiLine.points[i];
            finalCoordinates = MultiLine.points[i+1];
            drawLine();
        }
        MultiLine.points = [];

    }

    static initialize() {
        MultiLine.points = [];
        document.getElementById("instructions").innerHTML = "Choose at least 2 points, press ENTER to draw lines.";

        canvas.off("click");
        canvas.on("click", MultiLine.pointsEvent);

        $(document).on("keypress", MultiLine.enterKeyEvent);
    }  
}

$(document).on("DOMContentLoaded", initializeCanvas);
$(document).on("DOMContentLoaded", initializeButtons);
$(window).on("resize", initializeCanvas);
