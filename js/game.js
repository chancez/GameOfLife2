var map_size = 100;
var tile_size = 32;

var mapx = 20;
var mapy = 15;

var camerax = 0;
var cameray = 0;

function Tile(x, y, type)
{
	this.x = x;
	this.y = y;
	this.type = type;
	switch(type)
	{
		case 1:
			this.imagePath = 'img/water_far.png';
			break;
		case 2:
			this.imagePath = 'img/water_near.png';
			break;
		case 3:
			this.imagePath = 'img/grass.png';
			break;
		case 4:
			this.imagePath = 'img/forest.png';
			break;
		case 5:
			this.imagePath = 'img/mountains.png';
			break;
		case 6:
			this.imagePath = 'img/mountains_snow.png';
			break;
		case 7:
			this.imagePath = 'img/sand.png';
			break;
		case 8:
			this.imagePath = 'img/wasteland.png';
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
		for (var i = 0; i < map_size; i++)
		{
			var tileRow = new Array();
			for (var j = 0; j < map_size; j++)
			{
				tileRow[j] = new Tile(i, j, tileArray[i][j]);
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
	this.drawMap = function()
	{
		var i = 0;
		var j = 0;
		for (var x = camerax; x < Math.floor(camerax+mapx); x++)
		{
			for (var y = cameray; y < cameray+mapy; y++)
			{
		    	_canvasContext.drawImage(this.tiles[x][y].getImage(), i*tile_size, j*tile_size);
		    	j++;
			}
			j = 0;
			i++;
		}
	}
}

function TileArray()
{
	//generate the map here
	var rows = new Array();
	for (var i = 0; i < map_size; i++)
	{
		rows[i] = new Array();
		for (var j = 0; j < map_size; j++)
		{
			rows[i][j] = Math.floor((Math.random()*8)+1);
		}
	}
	return rows;
}

function Game() {
	var width = document.getElementById("gameCanvas").getAttribute("width");
	var height = document.getElementById("gameCanvas").getAttribute("height");


    this.Initialize = function () {
        this.fps = 30;
        this.DrawInterval = 50000/this.fps //1000 for ms
		var tileArray = new TileArray();
        this.Map = new Map(tileArray);
        this.Map.initMap(map_size);

        _canvas.addEventListener('mousemove', function(event) {
            mousePos= getMousePos(_canvas, event);
        }, false);

        //this.LoadContent();
        this.RunGameLoop();
    }

    this.LoadContent = function () {
    // load content – graphics, sound etc.
    // since all content is loaded run main game loop
    // Calls RunGameLoop method every ‘draw interval’
        this.GameLoop = setInterval(this.RunGameLoop, this.DrawInterval);
    }

    this.RunGameLoop = function () {
        this.Update();
        this.Draw();
    }

    this.Update = function () {
    // update game variables, handle user input, perform calculations etc.
        var x = mousePos.x;
        var y = mousePos.y;

        console.log("x: " + x + " y: " + y + " camerax: " + camerax + " cameray: " + cameray);

        switch(x)
        {
            case x > 540 - 2*tile_size:
                camerax += 1/this.fps;
                break;
            default:
                break;
        }

        switch(y)
        {

        }
    }

    this.Draw = function () {
    	this.Map.drawMap();
    }
}

function gameInit() {
    _canvas = document.getElementById("gameCanvas");
    _canvasContext = _canvas.getContext('2d');

    mousePos = {x: 0, y: 0};

    myGame = new Game;
    myGame.Initialize();

}
