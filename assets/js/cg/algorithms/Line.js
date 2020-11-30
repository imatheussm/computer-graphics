import * as tools from "../tools.js";


export function draw(initialCoordinates, finalCoordinates) {
    // let [x0, y0] = initialCoordinates.map(c => Math.round(c));
    // let [x1, y1] = finalCoordinates.map(c => Math.round(c));

    // let [x0, y0] = initialCoordinates.map(c => parseInt(c));
    // let [x1, y1] = finalCoordinates.map(c => parseInt(c));

    let [x0, y0] = initialCoordinates;
    let [x1, y1] = finalCoordinates;

    let [deltaX, deltaY] = [Math.abs(x1 - x0), Math.abs(y1 - y0)];
    let [signalX, signalY] = [(x0 < x1 ? 1 : -1), (y0 < y1 ? 1 : -1)];

    let error = deltaX - deltaY;


    while(true) {
        if ((x0 === x1) && (y0 === y1)) break;

        let twoTimesError = 2 * error;

        if (twoTimesError > -deltaY) { error -= deltaY; x0 += signalX; }
        if (twoTimesError <  deltaX) { error += deltaX; y0 += signalY; }

        tools.paintSquare([x0, y0]);
    }
}