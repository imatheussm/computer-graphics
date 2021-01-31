import * as Canvas from "./Canvas.js";
import * as Circle from "../algorithms/draw/Circle.js";
import * as Curve from "../algorithms/draw/Curve.js";
import * as FloodFill from "../algorithms/fill/FloodFill.js";
import * as Line from "../algorithms/draw/Line.js";
import * as ScanLine from "../algorithms/fill/ScanLine.js";
import * as Crop from "../algorithms/transform/Crop.js";
import * as Translation from "../algorithms/transform/Translation.js";
import * as Scale from "../algorithms/transform/Scale.js";
import * as Rotation from "../algorithms/transform/Rotation.js";
import * as Projection from "../algorithms/project/projection/Projection.js";
import * as Perspective from "../algorithms/project/perspective/Perspective.js";


export function initialize() {
    $("#circle-button").on("click", Circle.initialize);
    $("#flood-fill-button").on("click", FloodFill.initialize);
    $("#curve-button").on("click", Curve.initialize);
    $("#multi-line-button").on("click", Line.initialize);
    $("#scanline-button").on("click", ScanLine.initialize);
    $("#crop-button").on("click", Crop.initialize);
    $("#translation-button").on("click", Translation.initialize);
    $("#scale-button").on("click", Scale.initialize);
    $("#rotation-button").on("click", Rotation.initialize);
    $("#projection-button").on("click", Projection.initialize);
    $("#perspective-button").on("click", Perspective.initialize);
    $("#clear-button").on("click", Canvas.initialize);
}
