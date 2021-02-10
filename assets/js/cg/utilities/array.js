export function arrayAnd(arrayOne, arrayTwo) {
    let result = [];


    for (let i = 0; i < arrayOne.length; i++) result.push(arrayOne[i] && arrayTwo[i]);

    return result;
}

export function arrayOr(arrayOne, arrayTwo) {
    let result = [];


    for (let i = 0; i < arrayOne.length; i++) result.push(arrayOne[i] || arrayTwo[i]);

    return result;
}

export function anyDifference(arrayOne, arrayTwo) {
    for (let i = 0; i < arrayOne.length; i++) if (arrayOne[i] !== arrayTwo[i]) return true;

    return false;
}

export function isArrayEqual(arrayOne, arrayTwo) {
    if (arrayOne.length !== arrayTwo.length) return false;

    for (let i = 0; i <arrayOne.length ; i++) if (arrayOne[i] !== arrayTwo[i]) return false;

    return true;
}

export function includesArray(upperArray, lowerArray) {
    for (let i = 0; i < upperArray.length; i++) if (isArrayEqual(upperArray[i], lowerArray)) return true;

    return false;
}

export function multiplyAndAddFixedPoint(arrayOne, arrayTwo, fixedArray) {
    let multipliedArray = math.multiply(arrayOne, arrayTwo);


    return math.concat(
        math.add(math.column(multipliedArray, 0), fixedArray[0]),
        math.add(math.column(multipliedArray, 1), fixedArray[1]),
        1
    );
}