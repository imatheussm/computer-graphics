import * as globals from "./globals.js";

export function showMessage(message = "") {
    if(message === "") {
        globals.INSTRUCTIONS.css("visibility", "hidden");
    } else {
        globals.INSTRUCTIONS.css("visibility", "visible").html(message);
    }
}

export function extendMath() {
    Math.vectorAddition = function(firstVector, secondVector) {
        return firstVector.map((x, i) => x + secondVector[i])
    }

    Math.scalarMultiplication = function(vector, scalar) {
        return vector.map(x => x * scalar);
    }
}

export function getCoordinates(event) {
    let rectangle = $("#canvas")[0].getBoundingClientRect();

    let x = event.clientX - rectangle.left;
    let y = event.clientY - rectangle.top;


    return [Math.floor(x / globals.PIXEL_SIZE), Math.floor(y / globals.PIXEL_SIZE)];
}