import * as Canvas from "./Canvas.js";
import * as Circle from "../algorithms/Circle.js";
import * as Curve from "../algorithms/Curve.js";
import * as FloodFill from "../algorithms/FloodFill.js";
import * as Line from "../algorithms/Line.js";
import * as ScanLine from "../algorithms/ScanLine.js";
import * as Crop from "../algorithms/Crop.js";
import * as Translation from "../algorithms/Translation.js";
import * as Scale from "../algorithms/Scale.js";
import * as Rotation from "../algorithms/Rotation.js";


export function initialize() {
    $("#circle-button").on("click", Circle.initialize);
    $("#flood-fill-button").on("click", FloodFill.initialize);
    $("#curve-button").on("click", Curve.initialize);
    $("#multi-line-button").on("click", Line.initialize);
    $("#clear-button").on("click", Canvas.initialize);
    $("#scanline-button").on("click", ScanLine.initialize);
    $("#crop-button").on("click", Crop.initialize);
    $("#translation-button").on("click", Translation.initialize);
    $("#scale-button").on("click", Scale.initialize);
    $("#rotation-button").on("click", Rotation.initialize);
}
