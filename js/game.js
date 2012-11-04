var map_size = 100;
var tile_size = 32;

var mapx = 20;
var mapy = 15;

var camerax = 40;
var cameray = 40;

images = {
 water_far: 'img/water_far.png',
 water_near: 'img/water_near.png',
 grass: 'img/grass.png',
 forest: 'img/forest.png',
 mountains: 'img/mountains.png',
 mountains_snow: 'img/mountains_snow.png',
 sand: 'img/sand.png',
 wasteland: 'img/wasteland.png'
}

water_far = new Image();
water_far.src = images.water_far;

water_near = new Image();
water_near.src = images.water_near;

grass = new Image();
grass.src = images.grass;

forest = new Image();
forest.src = images.forest;

mountain = new Image();
mountain.src = images.mountains;

mountain_snow = new Image();
mountain_snow.src = images.mountains_snow;

sand = new Image();
sand.src = images.sand;

wasteland = new Image();
wasteland.src = images.wasteland;

function Tile(x, y, type)
{
	this.x = x;
	this.y = y;
	this.type = type;
	this.population = 0;
	this.img = function(type){
        switch(type)
        {
            case 1:
                return water_far;
            case 2:
                return water_near;
            case 3:
                return grass;
            case 4:
                return forest;
            case 5:
                return mountains;
            case 6:
                return mountains_snow;
            case 7:
                return sand;
            case 8:
                return wasteland;
        }
    }(type);
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
        var camx = Math.floor(camerax);
        var camy = Math.floor(cameray);
		for (var x = camx; x < camx+mapx; x++)
		{
			for (var y = camy; y < camy+mapy; y++)
			{
		    	_canvasContext.drawImage(this.tiles[x][y].img, i*tile_size, j*tile_size);
		    	_canvasContext.fillStyle = "rgba(255, 0 , 0, " + this.tiles[x][y].population + ")";
		    	_canvasContext.fillRect(i*tile_size, j*tile_size, tile_size, tile_size);
		    	j++;
			}
			j = 0;
			i++;
		}
	}

    this.drawCord = function() {
        var mouse_x = Math.floor(mousePos.x/32);
        var mouse_y = Math.floor(mousePos.y/32);
        var x_cord = mouse_x + camerax;
        var y_cord = mouse_y + cameray;

        _canvasContext.fillStyle = "yellow";
        _canvasContext.font = "15px Arial";
        _canvasContext.fillText("Pos: (" + x_cord + ", " + y_cord + ")", 10 , 470)
    }
}

function TileArray()
{
	//generate the water here
	var rows = new Array();
	for (var i = 0; i < map_size; i++)
	{
		rows[i] = new Array();
		for(var j = 0; j < map_size; j++) {
			rows[i][j] = 1;
		}
	}
	setBaseTile(rows);

	return rows;
}

function Game() {
	var width = document.getElementById("gameCanvas").getAttribute("width");
	var height = document.getElementById("gameCanvas").getAttribute("height");

    var that = this;

    this.Initialize = function () {
        this.fps = 30;
        this.DrawInterval = 1000/this.fps;
        this.CheckMouseInterval = 5000/this.fps;
		var tileArray = new TileArray();
        this.Map = new Map(tileArray);
        this.Map.initMap(map_size);

        _canvas.addEventListener('mousemove', function(event) {
            mousePos= getMousePos(event);
        }, false);

        _canvas.onmousedown = function(event)
        {
	        mousePos= getMousePos(event);
	        var x = Math.floor(mousePos.x/tile_size) + camerax;
	        var y = Math.floor(mousePos.y/tile_size) + cameray;
	        that.Map.getTiles()[x][y].population += .1;
        }

        this.LoadContent();
        //this.RunGameLoop();
    }

    this.LoadContent = function () {
    // load content – graphics, sound etc.
    // since all content is loaded run main game loop
    // Calls RunGameLoop method every ‘draw interval’
        this.GameLoop = setInterval(this.RunGameLoop, this.DrawInterval);
        this.CheckMouseLoop = setInterval(this.checkMouse, this.CheckMouseInterval);
    }

    this.RunGameLoop = function () {
        that.Update();
        that.Draw();
    }

    this.checkMouse = function()
    {
    // update game variables, handle user input, perform calculations etc.
        var x = Math.floor(mousePos.x/32);
        var y = Math.floor(mousePos.y/32);
        if (x < 0)
        {
	        x = 0;
        }
        if (y < 0)
        {
	        y = 0;
        }
        console.log("x: " + x + " y: " + y + " camerax: " + camerax + " cameray: " + cameray);

        if (camerax < map_size-mapx && x > mapx - 2){// - 2*tile_size:
            camerax += 1;
        }
        if (camerax > 0 && x < 2)
        {
	        camerax -= 1;
        }
        if (cameray < map_size-mapy && y > mapy-2)
        {
	        cameray += 1;
        }
        if (cameray > 0 && y < 2)
        {
	        cameray -= 1;
        }
	    that.Draw();
    }

    this.Update = function () {

	    // SET RULES FOR NEW TILESET HERE
	    var newPops = new Array();
	    for (var i = 0; i < map_size; i++)
	    {
	    	newPops[i] = new Array();
	    }


	    for (var x = 0; x < map_size; x++)
	    {
	    	for (var y = 0; y < map_size; y++)
	    	{
	    		var newPop = 0;
	    		newPops[x][y] = newPop;
	    	}
	    }
	    for (var x = 0; x < map_size; x++)
	    {
	    	for (var y = 0; y < map_size; y++)
	    	{
	    		var newPop = 0;
	    		
	    		// calculate the new population value of the tile x, y
	    		// to get tile x,y population: that.Map.getTiles()[x][y].population
	    		// to get tile x,y type: that.Map.getTiles()[x][y].type
	    		var currType = that.Map.getTiles()[x][y].type;
	    		
	    		if (currType == 1 || currType == 2)
	    		{
	    		}
	    		else
	    		{
		    		var currPop = that.Map.getTiles()[x][y].population;
		    		
		    		if (currPop < .7)
		    		{
			    		newPop += .1;
		    		}
		    		
	    		}
	    		

	    		// end calculate
	    		newPops[x][y] = newPop;
	    	}
	    }


	    for (var x = 0; x < map_size; x++)
	    {
	    	for (var y = 0; y < map_size; y++)
	    	{
	    		that.Map.getTiles()[x][y].population += newPops[x][y];
	    	}
	    }

    }

    this.Draw = function () {
    	this.Map.drawMap();
        this.Map.drawCord();
    }
}

function gameInit() {
    _canvas = document.getElementById("gameCanvas");
    _canvasContext = _canvas.getContext('2d');

    mousePos = {x: 0, y: 0};

    myGame = new Game;
    myGame.Initialize();

}

function setBaseTile(rows) { //may be parameters (continent, tileType, tileProbComp, tileProbDec, originalTileType)
	var continent = 25;
    var tileProbDec = (randRange(20)+5)/100; //probability subtraction constant
    var tileProbComp = .95; //original prob
    var tileType = 3;
    var startPosX = randRange(map_size);
    var startPosY = randRange(map_size);
    //console.log(startPosX + " " + startPosY)

    for (var i = 0; i<continent; i++) {
    	startPosX = randRange(map_size);
    	startPosY = randRange(map_size);
    	tileProbDec = (randRange(24)+1)/100;

    	rows[startPosX][startPosY] = 3; //sets base land points for continents
    	tileFlood(startPosX,startPosY,tileProbComp, tileProbDec, tileType, rows);
    }

};

//surrounds base cases of types with similar types
function tileFlood(startPosX, startPosY, tileProbComp, tileProbDec, tileType, rows) {
   	var tilesChanged = null;

   	while(tilesChanged != 0) {

   		tileProbComp -= tileProbDec; //automatic probability decrementing
   		tilesChanged = 0; //base case

    	//top left of base
	   	if(startPosX-1 >= 0 && startPosY-1 >= 0 && randRange(map_size) < map_size*tileProbComp && rows[startPosX-1][startPosY-1] != tileType) {
	   		rows[startPosX-1][startPosY-1] = tileType;
	   		tileFlood(startPosX-1, startPosY-1, tileProbComp, tileProbDec, tileType, rows);
	   		tilesChanged++;
	    }

    	//top mid of base
	   	if(startPosY-1 >= 0 && randRange(map_size) < map_size*tileProbComp && rows[startPosX][startPosY-1] != tileType) {
	   		rows[startPosX][startPosY-1] = tileType;
	   		tileFlood(startPosX, startPosY-1, tileProbComp, tileProbDec, tileType, rows);
	   		tilesChanged++;
	    }

    	//top left of base
	   	if(startPosY-1 >= 0 && startPosX+1 < map_size && randRange(map_size) < map_size*tileProbComp && rows[startPosX+1][startPosY-1] != tileType) {
	   		rows[startPosX+1][startPosY-1] = tileType;
	   		tileFlood(startPosX+1, startPosY-1, tileProbComp, tileProbDec, tileType, rows);
	   		tilesChanged++;
	    }

	   	//left of base
	   	if(startPosX-1 >= 0 && randRange(map_size) < map_size*tileProbComp && rows[startPosX-1][startPosY] != tileType) {
	   		rows[startPosX-1][startPosY] = tileType;
	    	tileFlood(startPosX-1, startPosY, tileProbComp, tileProbDec, tileType, rows);
	    	tilesChanged++;
	    }

	    //right of base
	    if(startPosX+1 < map_size && randRange(map_size) < map_size*tileProbComp && rows[startPosX+1][startPosY] != tileType) {
	    	rows[startPosX+1][startPosY] = tileType;
	    	tileFlood(startPosX+1, startPosY, tileProbComp, tileProbDec, tileType, rows);
	    	tilesChanged++;
	    }

	    //bot left of base
    	if(startPosY+1 < map_size && startPosX-1 >= 0 && randRange(map_size) < map_size*tileProbComp && rows[startPosX-1][startPosY+1] != tileType) {
    		rows[startPosX-1][startPosY+1] = tileType;
    		tileFlood(startPosX-1, startPosY+1, tileProbComp, tileProbDec, tileType, rows);
    		tilesChanged++;
    	}

    	//bot mid of base
	    if(startPosY+1 < map_size && randRange(map_size) < map_size*tileProbComp && rows[startPosX][startPosY+1] != tileType) {
	    	rows[startPosX][startPosY+1] = tileType;
	    	tileFlood(startPosX, startPosY+1, tileProbComp, tileProbDec, tileType, rows);
	    	tilesChanged++;
	    }

	    //bot right of base
	    if(startPosY+1 < map_size && startPosX+1 < map_size && randRange(map_size) < map_size*tileProbComp && rows[startPosX+1][startPosY+1] != tileType) {
	    	rows[startPosX+1][startPosY+1] = tileType;
	    	tileFlood(startPosX+1, startPosY+1, tileProbComp, tileProbDec, tileType, rows);
			tilesChanged++;
    	}
    	//console.log(tilesChanged);
    }
}

function updateLand() {
    var landProb = [33, 66, 99];
    var landProbGen;
    var waterFarID = 1;
    var waterNearID = 2;
    var grassID = 3;
    var forrestID = 4;
    var mountainID = 5;
    var mountainSnowID = 6;
    var sandID = 7;

    for(var y = 0; y < map_size; y++)
	{
        for(var x = 0; x < map_size; x++)
        {
            changeNearTo(rows, x, y, waterNearID, sandID);
        }
	}

    for(var y = 0; y < map_size; y++)
	{
        for(var x = 0; x < map_size; x++)
        {
            changeNearTo(rows, x, y, sandID, waterNearID);
        }
	}

	for(var y = 0; y < map_size; y++)
	{
        for(var x = 0; x < map_size; x++)
        {
            if(rows[x][y] === grassID)
            {
		        landProbGen = Math.floor(Math.random() * 99)

		        if (landProbGen <= landProb[0]) // Leave it as land
		            continue;

                else if(landProbGen > landProb[0] && landProbGen <= landProb[1]) // Set it as Mountain
                {
                    rows[x][y] = mountainID;
                }

                else if(landProbGen > landProb[1]) // Set it as Forrest
                {
                    rows[x][y] = forrestID;
                }
            }
        }
	}
}

function changeNearTo(array, x, y, compareID, newID) {

    if (array[x][y].type === compareID) {
        if (array[x + 1][y] && (x + 1) < map_size) {
            array[x + 1][y].type = newID;
        }

        else if (array[x - 1][y] && (x - 1) > map_size) {
            array[x - 1][y].type = newID;
        }

        else if (array[x - 1][y - 1] && (x - 1) > map_size && (y - 1) > map_size) {
            array[x - 1][y - 1].type = newID;
        }

        else if (array[x][y - 1] && (y - 1) > map_size) {
            array[x][y - 1].type = newID;
        }
        else if (array[x + 1][y - 1] && (x + 1) < map_size && (y - 1) > map_size) {
            array[x + 1][y - 1].type = newID;
        }

        else if (array[x - 1][y + 1] && (x - 1) > map_size && (y + 1) < map_size) {
            array[x - 1][y + 1].type = newID;
        }

        else if (array[x][y + 1] && (y + 1) < map_size) {
            array[x][y + 1].type = newID;
        }

        else if (array[x + 1][y + 1] && (x + 1) < map_size && (y + 1) < map_size) {
            array[x + 1][y + 1].type = newID;
        }
    }
}
