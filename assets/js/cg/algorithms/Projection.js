import * as Canvas from "../elements/Canvas.js";
import * as Instructions from "../elements/Instructions.js";
import * as Line from "./Line.js";

import * as colors from "../constants/colors.js";
import * as cube from "../utilities/cube.js";

import * as Cabinet from "./projections/Cabinet.js";
import * as Isometric from "./projections/Isometric.js";
import * as Orthographic from "./projections/Orthographic.js";

const MESSAGE = "Choose a projection type: " +
    "<a id='cabinet-link'>cabinet</a>, " +
    "<a id='isometric-link'>isometric</a> or " +
    "<a id='orthographic-link'>orthographic</a>."

let initialCoordinates, finalCoordinates, side, threeDimensionalCube, twoDimensionalCube;

export function initialize() {
    twoDimensionalCube = [];


    $(document).off("keypress");
    Canvas.CANVAS.off("click")
    Instructions.showMessage(MESSAGE);

    $("#cabinet-link").click(function(event) { initializationEvent("cabinet", event); });
    $("#isometric-link").click(function(event) { initializationEvent("isometric", event); });
    $("#orthographic-link").click(function(event) { initializationEvent("orthographic", event); });
}

function initializationEvent(projectionType, event) {
    Canvas.CANVAS.on("click", function(event) {
        sideEvent(projectionType, event);
    });
    Instructions.showMessage("Choose a POINT to be the UPPER-LEFT end of the cube.");
}

function sideEvent(projectionType, event) {
    initialCoordinates = Canvas.getCoordinates(event);


    Canvas.paintPixel(initialCoordinates, colors.BLUE);
    Canvas.CANVAS.off("click").on("click", function(event) {
        drawEvent(projectionType, event);
    });
    Instructions.showMessage("Choose a POINT upon which to calculate the SIDE of the cube.");
}

function drawEvent(projectionType, event) {
    finalCoordinates = Canvas.getCoordinates(event);
    side = Math.round(Math.sqrt(
        Math.pow(
            (finalCoordinates[0] - initialCoordinates[0]), 2
        ) + Math.pow(
        (finalCoordinates[1] - initialCoordinates[1]), 2
        )
    ))
    threeDimensionalCube = cube.generate(side);

    Canvas.paintPixel(initialCoordinates, colors.RED, true);
    if (projectionType === "isometric") project(Isometric.ROTATION_MATRIX);
    else if (projectionType === "cabinet") project(Cabinet.ROTATION_MATRIX);
    else if (projectionType === "orthographic") project(Orthographic.ROTATION_MATRIX);

    drawProjection();
    initialize();
}

let temporaryCoordinates;

function project(rotationMatrix) {
    for(let i = 0; i < threeDimensionalCube.length; i++) {
        temporaryCoordinates = [];

        for(let j = 0; j < threeDimensionalCube[i].length; j++) temporaryCoordinates.push([threeDimensionalCube[i][j]]);

        temporaryCoordinates = math.matrix(temporaryCoordinates);
        temporaryCoordinates = math.multiply(rotationMatrix, temporaryCoordinates);

        twoDimensionalCube.push([
            Math.round(temporaryCoordinates.get([0, 0]) + initialCoordinates[0]),
            Math.round(temporaryCoordinates.get([1, 0]) + initialCoordinates[1])
        ]);
    }
}

function drawProjection() {
    Line.draw(twoDimensionalCube[0], twoDimensionalCube[1]); // AB
    Line.draw(twoDimensionalCube[0], twoDimensionalCube[2]); // AC
    Line.draw(twoDimensionalCube[0], twoDimensionalCube[4]); // AE

    Line.draw(twoDimensionalCube[1], twoDimensionalCube[3]); // BD
    Line.draw(twoDimensionalCube[1], twoDimensionalCube[5]); // BF

    Line.draw(twoDimensionalCube[2], twoDimensionalCube[3]); // CD
    Line.draw(twoDimensionalCube[2], twoDimensionalCube[6]); // CG

    Line.draw(twoDimensionalCube[3], twoDimensionalCube[7]); // DH

    Line.draw(twoDimensionalCube[4], twoDimensionalCube[5]); // EF
    Line.draw(twoDimensionalCube[4], twoDimensionalCube[6]); // EG

    Line.draw(twoDimensionalCube[5], twoDimensionalCube[7]); // FH

    Line.draw(twoDimensionalCube[6], twoDimensionalCube[7]); // GH

    Canvas.refresh();
}