//utility functions for game.js

//gives a random number between 1 and the map_size
function randRange(map_size)
{
	var randomNum = Math.floor(Math.random()*map_size)+1;
	return randomNum;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), root = document.documentElement;

    // return relative mouse position
    var mouseX = evt.clientX - rect.top - root.scrollTop;
    var mouseY = evt.clientY - rect.left - root.scrollLeft;
    return {
      x: mouseX,
      y: mouseY
    };
}
