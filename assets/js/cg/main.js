import * as Buttons from "./elements/Buttons.js";
import * as Canvas from "./elements/Canvas.js";
import * as Slider from "./elements/Slider.js";


$(document).ready(function() {
    Canvas.initialize();
    Buttons.initialize();
    Slider.initialize();
});

$(window).on("resize", function() {
    Canvas.refresh();
});