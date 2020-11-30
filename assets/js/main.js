import * as globals from "./cg/globals.js";

import * as Buttons from "./cg/Buttons.js";
import * as Canvas from "./cg/Canvas.js";


$(document).ready(function() {
    Canvas.initializer();
    Buttons.initializer();
});

$(window).on("resize", function() {
    globals.updateCanvasDimensions();
    Canvas.paintPixelGrid();
});