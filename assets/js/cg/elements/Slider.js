import * as Canvas from "./Canvas.js";


export function initialize() {
    $("#density-slider").on("change", function() {
        let densityValue = parseInt($(this).val());

        Canvas.refresh(densityValue);
    });
}
