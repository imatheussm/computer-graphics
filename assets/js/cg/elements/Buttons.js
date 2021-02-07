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
    $("#circle-button").removeAttr('disabled').on("click", Circle.initialize);
    $("#flood-fill-button").removeAttr('disabled').on("click", FloodFill.initialize);
    $("#curve-button").removeAttr('disabled').on("click", Curve.initialize);
    $("#multi-line-button").removeAttr('disabled').on("click", Line.initialize);
    $("#scanline-button").removeAttr('disabled').on("click", ScanLine.initialize);
    $("#crop-button").removeAttr('disabled').on("click", Crop.initialize);
    $("#translation-button").removeAttr('disabled').on("click", Translation.initialize);
    $("#scale-button").removeAttr('disabled').on("click", Scale.initialize);
    $("#rotation-button").removeAttr('disabled').on("click", Rotation.initialize);
    $("#projection-button").removeAttr('disabled').on("click", Projection.initialize);
    $("#perspective-button").removeAttr('disabled').on("click", Perspective.initialize);
    $("#clear-button").removeAttr('disabled').on("click", Canvas.initialize);
}
