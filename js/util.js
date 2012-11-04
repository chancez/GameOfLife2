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

