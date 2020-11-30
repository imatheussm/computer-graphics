import * as constants from "./cg/constants.js";

import * as Buttons from "./cg/Buttons.js";
import * as Canvas from "./cg/Canvas.js";


$(document).ready(function() {
    constants.CONTEXT.translate(0.5, 0.5);

    Canvas.initializer();
    Buttons.initializer();
});

$(window).on("resize", Canvas.initializer);