export const INSTRUCTIONS = $("#instructions");

export function showMessage(message = "") {
    if(message === "") {
        INSTRUCTIONS.css("visibility", "hidden");
    } else {
        INSTRUCTIONS.css("visibility", "visible").html(message);
    }
}