import * as Buttons from "./elements/Buttons.js";
import * as Canvas from "./elements/Canvas.js";


$(document).ready(function() {
    Canvas.initialize();
    Buttons.initialize();
});

$(window).on("resize", function() {
    Canvas.updateCanvasDimensions();
    Canvas.drawPixelGrid();
    Canvas.paintPixelGrid();
});