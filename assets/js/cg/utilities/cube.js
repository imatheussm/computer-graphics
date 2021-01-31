export function generate(side) {
    let cube = [];

    cube.push([0,    0,    0   ]) // A
    cube.push([side, 0,    0   ]) // B
    cube.push([0,    side, 0   ]) // C
    cube.push([side, side, 0   ]) // D
    cube.push([0,    0,    side]) // E
    cube.push([side, 0,    side]) // F
    cube.push([0,    side, side]) // G
    cube.push([side, side, side]) // H

    return cube;
}