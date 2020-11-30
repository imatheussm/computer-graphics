import * as Circle from "../algorithms/Circle.js";
import * as Curve from "../algorithms/Curve.js";
import * as Line from "../algorithms/Line.js";
import * as Canvas from "./Canvas.js";

export function initialize() {
    $("#circle-button").on("click", Circle.initialize);
    $("#curve-button").on("click", Curve.initialize);
    $("#multi-line-button").on("click", Line.initialize);
    $("#clear-button").on("click", Canvas.initialize);
}