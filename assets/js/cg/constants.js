export const [CANVAS, INSTRUCTIONS]  = [$("#canvas"), $("#instructions")];
export const CONTEXT = CANVAS[0].getContext("2d");
export const DPI     = window.devicePixelRatio;

export let PIXEL_SIZE = 20;

export const BLUE = "#0099cc"