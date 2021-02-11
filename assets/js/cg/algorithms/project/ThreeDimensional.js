import * as Canvas from "../../elements/Canvas.js";
import * as Instructions from "../../elements/Instructions.js";
import * as Line from "../draw/Line.js";

import * as colors from "../../constants/colors.js";
import * as cube from "../../utilities/cube.js";

import * as Projection from "./projection/Projection.js";
import * as Perspective from "./perspective/Perspective.js";

import * as Cabinet from "./projection/types/Cabinet.js";
import * as Isometric from "./projection/types/Isometric.js";
import * as Orthographic from "./projection/types/Orthographic.js";

import * as OnePoint from "./perspective/types/OnePoint.js";
import * as TwoPoint from "./perspective/types/TwoPoint.js";
import * as ThreePoint from "./perspective/types/ThreePoint.js";

let initialCoordinates, finalCoordinates, side, temporaryCube, threeDimensionalCube, twoDimensionalCube, Tool,
    rotationType, rotationMatrix;

export function initialize(tool, type) {
    Canvas.disableEvents();
    Canvas.CANVAS.on("click", function(event) { sideEvent(tool, type, event); });
    Instructions.showMessage("Choose a POINT to be the UPPER-LEFT end of the cube.");
}

function sideEvent(tool, type, event) {
    initialCoordinates = Canvas.getCoordinates(event);


    Canvas.paintPixel(initialCoordinates, colors.BLUE);
    Canvas.CANVAS.off("click").on("click", function(event) { drawEvent(tool, type, event); });
    Instructions.showMessage("Choose a POINT upon which to calculate the SIDE of the cube.");
}

function drawEvent(tool, type, event) {
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

    if (tool === "projection") {
        Tool = Projection;

        if (type === "isometric") rotationType = Isometric;
        else if (type === "cabinet") rotationType = Cabinet;
        else if (type === "orthographic") rotationType = Orthographic;
    } else if (tool === "perspective") {
        Tool = Perspective;

        if (type === "one-point") rotationType = OnePoint;
        else if (type === "two-point") rotationType = TwoPoint;
        else if (type === "three-point") rotationType = ThreePoint;
    }

    rotationMatrix = rotationType.ROTATION_MATRIX;

    project(tool, initialCoordinates, threeDimensionalCube, rotationMatrix);
    draw(twoDimensionalCube);
    Tool.initialize();
}

function project(tool, initialCoordinates, threeDimensionalCube, rotationMatrix) {
    temporaryCube = math.multiply(rotationMatrix, threeDimensionalCube);

    if (tool === "projection") {
        twoDimensionalCube = temporaryCube;
    }
    else if (tool === "perspective") {
        twoDimensionalCube = math.divide(math.column(temporaryCube, 0), temporaryCube.get([3, 0]));

        for (let i = 1; i < math.size(temporaryCube)._data[1]; i++) {
            twoDimensionalCube = math.concat(
                twoDimensionalCube,
                math.divide(math.column(temporaryCube, i), temporaryCube.get([3, i])),
                1
            )
        }
    }

    twoDimensionalCube = math.concat(math.row(twoDimensionalCube, 0), math.row(twoDimensionalCube, 1), 0);
    twoDimensionalCube = math.transpose(math.round(twoDimensionalCube));
    twoDimensionalCube = math.concat(
        math.add(math.column(twoDimensionalCube, 0), initialCoordinates[0]),
        math.add(math.column(twoDimensionalCube, 1), initialCoordinates[1]),
        1
    );
    twoDimensionalCube = twoDimensionalCube._data;

    return twoDimensionalCube;
}

function draw(twoDimensionalCube) {
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