import * as Canvas from "../../../elements/Canvas.js";
import * as Instructions from "../../../elements/Instructions.js";

import * as ThreeDimensional from "../ThreeDimensional.js";

const MESSAGE = "Choose a perspective type: " +
    "<a id='one-point-link'>one-point</a>, " +
    "<a id='two-point-link'>two-point</a>, or " +
    "<a id='three-point-link'>three-point</a>."

export function initialize() {
    $(document).off("keypress");
    Canvas.CANVAS.off("click");
    Instructions.showMessage(MESSAGE);

    $("#one-point-link").click(function() { ThreeDimensional.initialize("perspective", "one-point"); });
    $("#two-point-link").click(function() { ThreeDimensional.initialize("perspective", "two-point"); });
    $("#three-point-link").click(function() { ThreeDimensional.initialize("perspective", "three-point"); });
}