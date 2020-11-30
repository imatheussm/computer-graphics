import * as Circle from "./algorithms/Circle.js";
import * as Curve from "./algorithms/Curve.js";
import * as Line from "./algorithms/Line.js";
import * as Canvas from "./Canvas.js";

export function initializer() {
    $("#circle-button").on("click", Circle.initializer);
    $("#curve-button").on("click", Curve.initializer);
    $("#multi-line-button").on("click", Line.initializer);
    $("#clear-button").on("click", Canvas.initializer);
}