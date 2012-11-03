function Game() {
    this.Initialize = function () {
    // initialize all game variables
    }
    this.LoadContent = function () {
    // load content – graphics, sound etc.
    // since all content is loaded run main game loop
    // Calls RunGameLoop method every ‘draw interval’
        this.GameLoop = setInterval(this.RunGameLoop, this.DrawInterval);
    }

    this.RunGameLoop = function (game) {
        this.Update();
        this.Draw();
    }

    this.Update = function () {
    // update game variables, handle user input, perform calculations etc.
    }

    this.Draw = function () {
    // draw game frame
    }
}

var _canvas = document.getElementById("gameCanvas");
var _canvasContext = _canvas.getContext('2d');

_canvasContext.fillStyle = "rgb(127,0,0)";
_canvasContext.fillRect =(10, 20, 100, 85);
