import * as Canvas from "../elements/Canvas.js";
import * as Instructions from "../elements/Instructions.js";

let initialCoordinates, finalCoordinates, cube;

export function initializeOrthogonal() { initialize("orthogonal"); }

export function initializePerspective() { initialize("perspective"); }

function initialize(projectionType) {
    $(document).off("keypress");
    Canvas.CANVAS.off("click").on("click", function(event) {
        sideEvent(projectionType, event);
    });
    Instructions.showMessage("Choose a POINT to be the LOWER-LEFT end of the cube.");
}

function sideEvent(projectionType, event) {
    initialCoordinates = Canvas.getCoordinates(event);


    Canvas.CANVAS.off("click").on("click", function(event) {
        cubeGeneratorEvent(projectionType, event);
    });
    Instructions.showMessage("Choose a POINT upon which to calculate the SIDE of the cube.");
}

function cubeGeneratorEvent(projectionType, event) {
    
}