import * as Canvas from "../../../elements/Canvas.js";
import * as Instructions from "../../../elements/Instructions.js";

import * as ThreeDimensional from "../ThreeDimensional.js";

const MESSAGE = "Choose a projection type: " +
    "<a id='cabinet-link'>cabinet</a>, " +
    "<a id='isometric-link'>isometric</a>, or " +
    "<a id='orthographic-link'>orthographic</a>."

export function initialize() {
    $(document).off("keypress");
    Canvas.CANVAS.off("click");
    Instructions.showMessage(MESSAGE);

    $("#cabinet-link").click(function() { ThreeDimensional.initialize("projection", "cabinet"); });
    $("#isometric-link").click(function() { ThreeDimensional.initialize("projection", "isometric"); });
    $("#orthographic-link").click(function() { ThreeDimensional.initialize("projection", "orthographic"); });
}
