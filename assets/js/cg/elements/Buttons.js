import * as Circle from "../algorithms/Circle.js";
import * as Curve from "../algorithms/Curve.js";
import * as Line from "../algorithms/Line.js";
import * as FloodFill from "../algorithms/FloodFill.js";
import * as Canvas from "./Canvas.js";
import * as Scanline from "../algorithms/Scanline.js";

export function initialize() {
    $("#circle-button").on("click", Circle.initialize);
    $("#flood-fill-button").on("click", FloodFill.initialize);
    $("#curve-button").on("click", Curve.initialize);
    $("#multi-line-button").on("click", Line.initialize);
    $("#clear-button").on("click", Canvas.initialize);
    $("#scaline-button").on("click", Scanline.initialize);

}
