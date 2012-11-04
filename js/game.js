function Game() {
	var width = document.getElementById("gameCanvas").getAttribute("width");
	var height = document.getElementById("gameCanvas").getAttribute("height");
	
    this.initMap = function(map_size, tile_size) {
        //for (var x = 0; x < map_size; x + this.tile_size) {

        /*    for (var y = 0; y < map_size; y + this.tile_size) {
                _canvasContext.drawImage(this.water_tile, x, y);
            } */
        //}
    }


    this.Initialize = function () {
        var map = [];
        var map_size = 5;
        var tile_size = 32;

        this.initMap(map_size, tile_size);

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

function Map()
{
	
}

function gameInit() {
    _canvas = document.getElementById("gameCanvas");
    _canvasContext = _canvas.getContext('2d');

    var water_tile = new Image();
    water_tile.onload = function() {
        _canvasContext.drawImage(water_tile, 5, 5);
        _canvasContext.drawImage(water_tile, 50, 50);
    };
    water_tile.src = "img/water.png";

    myGame = new Game;
    myGame.Initialize();
}
