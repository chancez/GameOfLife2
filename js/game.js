var map_size = 5;
var tile_size = 32;

function Tile(x, y, type)
{
	this.x = x;
	this.y = y;
	this.type = type;
	switch(type)
	{
		case 1:
			this.imagePath = 'img/water.png';
			break;
		case 2:
			this.imagePath = 'img/grass.png';
			break;
	}	
	this.getImage = function()
	{
		var img = new Image();
		img.src = this.imagePath;
		return img;
	}
	this.img = this.getImage();
}
	
function Map(tileArray)
{
	this.tiles = new Array();
	this.initMap = function(map_size)
	{
		for (i = 0; i < map_size; i++)
		{
			var tileRow = new Array();
			for (j = 0; j < map_size; j++)
			{
				tileRow[j] = new Tile(i, j, 1);
			}
			this.tiles[i] = tileRow;
		}
	}
	this.getTile = function(x, y)
	{
		return this.tiles[x][y];
	}
	this.getTiles = function()
	{
		return this.tiles;
	}
}

function Game() {
	var width = document.getElementById("gameCanvas").getAttribute("width");
	var height = document.getElementById("gameCanvas").getAttribute("height");

	var tileArray = new Array();
	this.Map = new Map(tileArray);

    this.Initialize = function () {
        var map = [];

        this.Map.initMap(map_size);

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

function gameInit() {
    _canvas = document.getElementById("gameCanvas");
    _canvasContext = _canvas.getContext('2d');

    myGame = new Game;
    myGame.Initialize();
    
	var tiles = myGame.Map.getTiles();
	for (x in tiles)
	{
    	for (y in tiles[x])
    	{
	    	_canvasContext.drawImage(tiles[x][y].getImage(), x*tile_size, y*tile_size);
    	}
	}


    myGame = new Game;
    myGame.Initialize();
}
