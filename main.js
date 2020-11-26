var c_canvas = document.getElementById("c");
var context = c_canvas.getContext("2d");

function makeGrid(){
context.fillStyle = "white";
context.fillRect(0,0,501,381);

for (var x = 0.5; x < 501; x += 20) {
  context.moveTo(x, 0);
  context.lineTo(x, 381);
}

for (var y = 0.5; y < 381; y += 20) {
  context.moveTo(0, y);
  context.lineTo(500, y);
}

context.strokeStyle = "#ddd";
context.stroke();
}

makeGrid();

function getNearestSquare(x, y) {
if (x < 0 || y < 0) return null;
    x = (Math.floor(x / 20) * 20) + 0.5
    y = (Math.floor(y / 20) * 20) + 0.5
    return {x: x, y: y};
}

function line(x0, y0, x1, y1) {
   var dx = Math.abs(x1 - x0);
   var dy = Math.abs(y1 - y0);
   var sx = (x0 < x1) ? 1 : -1;
   var sy = (y0 < y1) ? 1 : -1;
   var err = dx - dy;

   while(true) {
      setPixel(x0, y0); // Do what you need to for this

      if ((x0 === x1) && (y0 === y1)) break;
      var e2 = 2*err;
      if (e2 > -dy) { err -= dy; x0  += sx; }
      if (e2 < dx) { err += dx; y0  += sy; }
   }
}

function paintSquare(x, y){
	x = x*20;
  y = y*20;
  context.fillStyle="#FF0000";
	context.fillRect(x,y,20,20);
}

function posToSqr(x, y){
	return [Math.floor(x/20), Math.floor(y/20)];
}

function line(x0, y0, x1, y1) {
   var dx = Math.abs(x1 - x0);
   var dy = Math.abs(y1 - y0);
   var sx = (x0 < x1) ? 1 : -1;
   var sy = (y0 < y1) ? 1 : -1;
   var err = dx - dy;

   while(true) {
      paintSquare(x0, y0); // Do what you need to for this

      if ((x0 === x1) && (y0 === y1)) break;
      var e2 = 2*err;
      if (e2 > -dy) { err -= dy; x0  += sx; }
      if (e2 < dx) { err += dx; y0  += sy; }
   }
}

 function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }


var x0 = 0;
var y0 = 0;


function second_click(event) {
    var pos = getMousePos(c_canvas,event);
    var start_sqr_pos = posToSqr(pos.x, pos.y);
    paintSquare(start_sqr_pos[0], start_sqr_pos[1]);
    var x1 = start_sqr_pos[0];
    var y1 = start_sqr_pos[1];
    line(x0, y0, x1, y1);
    c_canvas.removeEventListener("click", second_click);
    c_canvas.addEventListener("click", first_click);
  }

function first_click(event) {
    makeGrid();
    var pos = getMousePos(c_canvas,event);
    var start_sqr_pos = posToSqr(pos.x, pos.y);
    paintSquare(start_sqr_pos[0], start_sqr_pos[1]);
    x0 = start_sqr_pos[0];
      y0 = start_sqr_pos[1];
    c_canvas.removeEventListener("click", first_click);
    c_canvas.addEventListener("click", second_click);
}
 
function activate_bresenham(event){
    c_canvas.addEventListener("click", first_click);
}

var bresenham_button = document.getElementById("bresenham_button");
bresenham_button.addEventListener("click", activate_bresenham); 

