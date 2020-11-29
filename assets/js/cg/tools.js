import * as constants from "./constants.js";

export function showMessage(message = "") {
    if(message === "") {
        constants.INSTRUCTIONS.css("visibility", "hidden");
    } else {
        constants.INSTRUCTIONS.css("visibility", "visible").html(message);
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

export function paintSquare(coordinates, color="#ff0000") {
    let context = $("#canvas")[0].getContext("2d");

    coordinates = coordinates.map(x => x * constants.PIXEL_SIZE)

    context.fillStyle = color;
    context.fillRect(coordinates[0], coordinates[1], constants.PIXEL_SIZE, constants.PIXEL_SIZE);
}

export function getCoordinates(event) {
    let rectangle = $("#canvas")[0].getBoundingClientRect();

    let x = event.clientX - rectangle.left;
    let y = event.clientY - rectangle.top;


    return [Math.floor(x / constants.PIXEL_SIZE), Math.floor(y / constants.PIXEL_SIZE)];
}