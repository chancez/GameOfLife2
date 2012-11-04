//utility functions for game.js

//gives a random number between 1 and the map_size
function randRange(map_size)
{
	var randomNum = Math.floor(Math.random()*map_size);
	return randomNum;
}

function getMousePos(evt) {
   /*
 var rect = canvas.getBoundingClientRect(), root = document.documentElement;

    // return relative mouse position
    var mouseX = evt.clientX - rect.top - root.scrollTop;
    var mouseY = evt.clientY - rect.left - root.scrollLeft;
*/
	var mouseX;
	var mouseY;
    if(evt.offsetX) 
	{
        mouseX = evt.offsetX;
        mouseY = evt.offsetY;
    }
    else if(evt.layerX) 
	{
        mouseX = evt.layerX;
        mouseY = evt.layerY;
    }
    return {
      x: mouseX,
      y: mouseY
    };
}
