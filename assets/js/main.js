let [canvas, instructions] = [$("#canvas"), $("#instructions")];
let initialCoordinates, finalCoordinates, pixelSize;

const dpi     = window.devicePixelRatio;
const context = canvas[0].getContext("2d");

context.translate(0.5, 0.5);

function resetInstructions(){
    instructions.html("Choose an option.");
    instructions.css("visibility", "hidden");
}


function arrayAddition(array1, array2){
    var result = [];
    if (array1.length != array2.length){
        return 0;
    }

    for (var i=0; i<array1.length; i++){
        result.push(array1[i] + array2[i]);
    }

    return result;
}

function scalarMult(array, scalar){
    var result = [];
    
    for (var i=0; i<array.length; i++){
        result.push(array[i] * scalar);
    }

    return result;

}

function initializeCanvas() {
    // resetInstructions();
    
    if (typeof pixelSize === 'undefined') {
        pixelSize = 20;
    }

    drawPixelGrid(pixelSize);
}

function initializeButtons() {
    $("#bresenham-button").on("click", activateBresenham);
    $("#circle-button").on("click", Circle.initializeCircle);
    $("#curve-button").on("click", Curve.initialize);
    $("#multi-line-button").on("click", MultiLine.initialize);
    $("#clear-button").on("click", initializeCanvas);
}

function activateBresenham() {
    instructions.html("Choose two points to draw a line.");
    instructions.css("visibility", "visible");

    canvas.on("click", firstClick);
}

function drawPixelGrid(pixelSize) {
    let height = canvas[0].offsetHeight * dpi;
    let width  = canvas[0].offsetWidth * dpi;


    canvas[0].setAttribute('height', height.toString());
    canvas[0].setAttribute('width', width.toString());

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
    let rectangle = canvas[0].getBoundingClientRect();

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
        instructions.html("Choose a point to define the CENTER of the circle.");
        instructions.css("visibility", "visible");
    }

    static centerEvent(event){
        instructions.html("Choose another point to define the RADIUS of the circle.");
        instructions.css("visibility", "visible");

        const circle_center = getCoordinates(event);
        Circle.center = circle_center;
        paintSquare(circle_center[0], circle_center[1]);

        canvas.off("click");
        canvas.on("click", Circle.radiusEvent);
    }

    static radiusEvent(event){
        Circle.showCenterMessage();
        const border = getCoordinates(event);
        const x_dist = Math.pow(Circle.center[0] - border[0], 2);
        const y_dist = Math.pow(Circle.center[1] - border[1], 2);
        Circle.radius = parseInt(Math.sqrt(x_dist + y_dist).toString());

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
        let x = Circle.radius;
        let y = 0;
        let error = 1 - x;
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
        instructions.html("Choose INITIAL point of the curve.");
        instructions.css("visibility", "visible");

    }

    static controlPointsEvent(event){
        const point = getCoordinates(event);
        paintSquare(point[0], point[1]);
        Curve.control_points.push(point);
    }

    static initialPointEvent(event){
        instructions.html("Choose FINAL point of the curve.");
        instructions.css("visibility", "visible");

        const point = getCoordinates(event);
        paintSquare(point[0], point[1]);
        Curve.initial_point = point;
        Curve.control_points.push(point);
        Curve.points_to_draw.push(point);
        canvas.off("click");
        canvas.on("click", Curve.finalPointEvent);
    }

    static finalPointEvent(event){
        instructions.html("Click on CONTROL points. Press ENTER to draw the curve.");
        instructions.css("visibility", "visible");

        const point = getCoordinates(event);
        paintSquare(point[0], point[1]);
        Curve.final_point = point;
        Curve.final_point = point;
        canvas.off("click");
        canvas.on("click", Curve.controlPointsEvent);
        $(document).on("keypress", Curve.enterKeyEvent);

    }

    static controlPointsEvent(event){
        var point = getCoordinates(event);
        paintSquare(point[0], point[1], "#0099cc");
        Curve.control_points.push(point);
    }
    
    static enterKeyEvent(event){
        canvas.off("click");
        Curve.control_points.push(Curve.final_point);
        if (event.which === 13){
            Curve.draw();
        }
        Curve.initialize();
        canvas.off("click");
    }

    static belzierPoint(t){
        var degree = Curve.control_points.length - 1;
        var points = Curve.control_points.slice();
        for (var r = 1; r <= degree; r++){
            for (var i = 0; i <= degree - r; i++){
                var first_mult = scalarMult(points[i], (1.0-t)); 
                var second_mult = scalarMult(points[i+1], t); 
                points[i] = arrayAddition(first_mult, second_mult);
            }
        }
        return points[0];
    }

    static draw(){
        const num_points = Curve.points_to_draw.length;
        initialCoordinates = Curve.initial_point;
        var t;
        for (var i = 1; i <= Curve.num_lines; i++){
            t = (1.0/Curve.num_lines)*i;
            var final_point = Curve.belzierPoint(t);
            // burro, tem que mudar
            finalCoordinates = [parseInt(final_point[0]), 
                                parseInt(final_point[1])]
            drawLine();
            initialCoordinates = finalCoordinates;
        }
    }

    static initialize() {
        Curve.points_to_draw = [];
        Curve.control_points = [];
        Curve.initial_point = [0,0];
        Curve.final_point = [0,0];
        initialCoordinates = [];
        finalCoordinates = [];

        Curve.resetInstructions();
        canvas.off("click");
        canvas.on("click", Curve.initialPointEvent);
    }  
}

class MultiLine {
    static points = [];

    static pointsEvent(event){
        const point = getCoordinates(event);
        paintSquare(point[0], point[1]);
        MultiLine.points.push(point);
    }

    static enterKeyEvent(event){
        if (event.which === 13){
            MultiLine.draw();
        }
    }

    static draw(){
        const num_points = MultiLine.points.length;
        for (let i = 0; i < num_points - 1; i++){
            initialCoordinates = MultiLine.points[i];
            finalCoordinates = MultiLine.points[i+1];
            drawLine();
        }
        MultiLine.points = [];

    }

    static initialize() {
        instructions.html("Choose at least 2 points, press ENTER to draw lines.");
        instructions.css("visibility", "visible");

        MultiLine.points = [];

        canvas.off("click");
        canvas.on("click", MultiLine.pointsEvent);

        $(document).on("keypress", MultiLine.enterKeyEvent);
    }  
}

$(document).on("DOMContentLoaded", initializeCanvas);
$(document).on("DOMContentLoaded", initializeButtons);
$(window).on("resize", initializeCanvas);
