export function generate(side) {
    let cube = [];

    cube.push([0,    0,    0,    1]) // A
    cube.push([side, 0,    0,    1]) // B
    cube.push([0,    side, 0,    1]) // C
    cube.push([side, side, 0,    1]) // D
    cube.push([0,    0,    side, 1]) // E
    cube.push([side, 0,    side, 1]) // F
    cube.push([0,    side, side, 1]) // G
    cube.push([side, side, side, 1]) // H

    return math.transpose(cube);
}