import * as constants from "./cg/constants.js";
import * as tools from "./cg/tools.js";

import * as Circle from "./cg/algorithms/Circle.js";
import * as Curve from "./cg/algorithms/Curve.js";
import * as Line from "./cg/algorithms/Line.js";


$(document).ready(function() {
    let [canvas, instructions] = [$("#canvas"), $("#instructions")];
    let initialCoordinates, finalCoordinates;

    const context = canvas[0].getContext("2d");

    context.translate(0.5, 0.5);

    function initializeCanvas() {
        // resetInstructions();

        if (typeof constants.PIXEL_SIZE === 'undefined') {
            constants.PIXEL_SIZE = 20;
        }

        drawPixelGrid(constants.PIXEL_SIZE);
    }

    function initializeButtons() {
        $("#bresenham-button").on("click", activateBresenham);
        $("#circle-button").on("click", Circle.initializer);
        $("#curve-button").on("click", Curve.initializer);
        $("#multi-line-button").on("click", MultiLine.initialize);
        $("#clear-button").on("click", initializeCanvas);
    }

    function activateBresenham() {
        instructions.html("Choose two points to draw a line.");
        instructions.css("visibility", "visible");

        canvas.on("click", firstClick);
    }

    function drawPixelGrid(pixelSize) {
        let height = canvas[0].offsetHeight * constants.DPI;
        let width  = canvas[0].offsetWidth * constants.DPI;


        canvas[0].setAttribute('height', height.toString());
        canvas[0].setAttribute('width', width.toString());

        context.fillStyle   = "#2b2b2b";
        context.strokeStyle = "#3c3c3c";

        for (let x = 0; x < width; x += pixelSize) {
            context.moveTo(x, 0);
            context.lineTo(x, height);
        }

        for (let y = 0; y < height; y += pixelSize) {
            context.moveTo(0, y);
            context.lineTo(width, y);
        }

        context.fillRect(0, 0, width, height);
        context.stroke();
    }

    function firstClick(event) {
        initialCoordinates = tools.getCoordinates(event);

        tools.paintSquare(initialCoordinates, initialCoordinates);

        canvas.off("click");
        canvas.on("click", secondClick);
    }

    function secondClick(event) {
        finalCoordinates = tools.getCoordinates(event);

        Line.draw(initialCoordinates, finalCoordinates);

        canvas.off("click");
        canvas.on("click", firstClick);
    }

    class MultiLine {
        static points = [];

        static pointsEvent(event){
            const point = tools.getCoordinates(event);
            tools.paintSquare(point);
            MultiLine.points.push(point);
        }

        static enterKeyEvent(event){
            if (event.which === 13){
                MultiLine.draw();
            }
        }

        static draw(){
            const num_points = MultiLine.points.length;
            for (let i = 0; i < num_points - 1; i++) {
                initialCoordinates = MultiLine.points[i];
                finalCoordinates = MultiLine.points[i + 1];
                Line.draw(initialCoordinates, finalCoordinates);
            }
            MultiLine.points = [];

        }

        static initialize() {
            canvas.off("click");
            $(document).off("keypress");
            instructions.html("Choose at least 2 points, press ENTER to draw lines.");
            instructions.css("visibility", "visible");

            MultiLine.points = [];

            canvas.on("click", MultiLine.pointsEvent);

            $(document).on("keypress", MultiLine.enterKeyEvent);
        }
    }

    initializeCanvas();
    initializeButtons();

    $(window).on("resize", initializeCanvas);
});