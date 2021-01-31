export function getIntersectionPoint(borderLine, realLine){
    let x1 = realLine[0][0];
    let x2 = realLine[1][0];
    let y1 = realLine[0][1];
    let y2 = realLine[1][1];
    let xi, yi;

    if (borderLine[0][0] === borderLine[1][0]) {
        xi = borderLine[0][0];

        yi = (xi - x1)*(y2-y1)/(x2-x1) + y1;
    } else if (borderLine[0][1] === borderLine[1][1]){
        yi = borderLine[0][1];
        xi = (yi - y1)*(x2-x1)/(y2-y1) + x1;
    }
    return [Math.round(xi), Math.round(yi)];
}
