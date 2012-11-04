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
 
function setTile() {
    map.addTile(startPosX, startPosY, 3);
    for( tileProb = Math.floor(Math.random() * 99); tileProb < tileProbComp; tileProbComp -= .25 ){
        
        
        if( (startPosX-1) >= 0 && tileProbComp >= .25){
            
        }

        tileType = map.getTile(x, y).getTileType();
    }
}
 
 
function updateLand() {
 
	for(var arrayIndex = 0; arrayIndex < landLoc.length; arrayIndex++)
	{
		landProbGen = Math.floor(Math.random() * 99)
 
		if (landProbGen <= landProb[0]) // Leave it as land
		    continue;
 
        else if(landProbGen > landProb[0] && landProbGen <= landProb[1]) // Set it as Mountain
        {
            newTile.id = mountID 
            map.addTile(landLocX[arrayIndex], landLocY, newTile);     
        }
 
        else if(landProbGen > landProb[1]) // Set it as Forrest 
        {
            newTile.id = forrestID;
            map.addTile(landLocX[arrayIndex], landLocY[arrayIndex], newTile);
        }
	}
}

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
		for (var x = camerax; x < camerax+mapx; x++)
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
		var tileArray = new TileArray();
    	this.Map = new Map(tileArray);
        this.Map.initMap(map_size);
        this.Draw();

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
    	this.Map.drawMap();
    }
}

function gameInit() {
    _canvas = document.getElementById("gameCanvas");
    _canvasContext = _canvas.getContext('2d');

    myGame = new Game;
    myGame.Initialize();

}
