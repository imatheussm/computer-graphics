export function arrayAnd(array1, array2){
    let result = [];
    for (let i =0; i < array1.length; i++){
        result.push(array1[i] && array2[i]);
    }
    return result;
}

export function arrayScalarSum(array, scalar){
    let result = [];
    for (let i=0; i < array1.length; i++){
        result.push(array[i] + scalar);
    }
    return result;
}

export function arrayOr(array1, array2){
    let result = [];
    for (let i =0; i < array1.length; i++){
        result.push(array1[i] || array2[i]);
    }
    return result;
}

export function anyDifference(array1, array2){
    for (let i =0; i<array1.length; i++){
        if (array1[i] !== array2[i]){
            return true;
        }
    }
    return false;
}

export function isArrayEqual(array1, array2){
    if (array1.length !== array2.length){
        return false;
    }
    for (let i =0; i <array1.length ; i++){
        if (array1[i] !== array2[i]){
            return false;
        }
    }
    return true;
}

export function includesArray(upper_array, bottom_array){
    for (let i = 0; i < upper_array.length; i++){
        if (isArrayEqual(upper_array[i], bottom_array)){
            return true
        }
    }
    return false;
}