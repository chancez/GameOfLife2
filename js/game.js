var map_size = 100;
var tile_size = 32;

var mapx = 0;
var mapy = 0;

var camerax = 40;
var cameray = 40;

var PopScore = new Array();
var popTotal = 0;
var maxPop = 0;

var width;
var height;

var numClicks = 0;

var highestPop = 0;

images = {
 water_far: 'img/water_far.png',
 water_near: 'img/water_near.png',
 grass: 'img/grass.png',
 forest: 'img/forest.png',
 mountains: 'img/mountains.png',
 mountains_snow: 'img/mountains_snow.png',
 sand: 'img/sand.png',
 wasteland: 'img/wasteland.png',
 city: 'img/city.png'
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

mountains_snow = new Image();
mountains_snow.src = images.mountains_snow;

sand = new Image();
sand.src = images.sand;

wasteland = new Image();
wasteland.src = images.wasteland;

city = new Image();
city.src = images.city;

function Game() 
{
    width = document.getElementById("gameCanvas").getAttribute("width");
    height = document.getElementById("gameCanvas").getAttribute("height");

    var that = this;

    this.Initialize = function () 
	{
    	this.turns = 0;
        this.fps = 30;
        this.DrawInterval = 1000/this.fps;
        this.CheckMouseInterval = 5000/this.fps;
        var tileArray = new TileArray();
        this.Map = new Map(tileArray);
        this.Map.initMap(map_size);
		minimap(this.Map);

      	 document.getElementById("gameArea").addEventListener('mousemove', function(event) 
		{
            mousePos = getMousePos(event);
        }, false);

        _canvas.onmousedown = function(event)
        {
        	if (numClicks < 3)
        	{
	            mousePos= getMousePos(event);
	            var x = Math.floor(mousePos.x/tile_size) + camerax;
	            var y = Math.floor(mousePos.y/tile_size) + cameray;
	            if (that.Map.getTiles()[x][y].population < .9 && that.Map.getTiles()[x][y].type > 2)
	            {
	                that.Map.getTiles()[x][y].population += .01
	            }
	        	numClicks++;
	        }
        }

        var doKeyDown = function(event) 
		{
            alert(event.keyCode);
        }

        _canvas.addEventListener( "keydown", doKeyDown, true);



        this.LoadContent();
        //this.RunGameLoop();
    }

    this.LoadContent = function () 
	{
    // load content – graphics, sound etc.
    // since all content is loaded run main game loop
    // Calls RunGameLoop method every ‘draw interval’
        this.GameLoop = setInterval(this.RunGameLoop, this.DrawInterval);
        this.CheckMouseLoop = setInterval(this.checkMouse, this.CheckMouseInterval);
    }

    this.RunGameLoop = function () 
	{
        that.Update();
        that.Draw();
		minimap(that.Map);
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
        //console.log("x: " + x + " y: " + y + " camerax: " + camerax + " cameray: " + cameray);

        if (camerax < map_size-mapx-1 && x > mapx - 2 && x <= mapx)
        {
            camerax += 1;
        }
        if (camerax > 0 && x < 2 && x >= 0)
        {
            camerax -= 1;
        }
        if (cameray < map_size-mapy-1 && y > mapy-2 && y <= mapy)
        {
            cameray += 1;
        }
        if (cameray > 0 && y < 2 && y > 0)
        {
            cameray -= 1;
        }
        that.Draw();
    }

    this.Update = function () 
	{
        PopScore[this.turns] = popTotal;
	    this.turns++;
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
                var newPop = newPops[x][y];

                // calculate the new population value of the tile x, y

                var currType = that.Map.getTiles()[x][y].type;
                var currPop = that.Map.getTiles()[x][y].population;
				var currBuilt = that.Map.getTiles()[x][y].built;
				var currRes = that.Map.getTiles()[x][y].resources;
	
                if (that.Map.getTiles()[x][y].life <= 0 && currType != 8 && currType != 9)
                {
	                that.Map.getTiles()[x][y].setType(8);
	                that.Map.getTiles()[x][y].built = 0;
                }
                else if (currType == 1 || currType == 2)
                {
                    newPop -= currPop;
                }
                else
                {
		    		var limit = .4;
					if (currType != 9)
					{
						that.Map.getTiles()[x][y].resources -= currPop;
					}
		            if (currType == 7 || currType == 5 || currType == 6)
		            {
		                limit = .2;
		            }
		            if (currType == 8)
		            {
			           limit = 0;
		            }
		            if (currType == 4)
		            {
						limit = .3;
						if (currBuilt >= randRange(500)+200)
						{
							that.Map.tiles[x][y].setType(3);
							that.Map.tiles[x][y].built = 0;
							that.Map.tiles[x][y].resources += 500;
						}
		            }
		            if (currType == 3)
		            {
			            limit = .5;
		            }
					if (currType == 9)
					{
						limit = .9;
					}
                    var tiles = that.Map.getNeightbors(x,y);
					
		    		if (currPop >= .3)
		    		{
		    			for (tile in tiles)
		    			{
				    		var chance = randRange(9);
				    		if (chance == 0)
				    		{
			    				if (tiles[tile].type != 1 && tiles[tile].type != 2)
			    				{
				    				newPops[tiles[tile].x][tiles[tile].y] += .01;
				    			}
				    		}
		    			}
		    		}

		    		var sum = currPop;
					var citiesClose = 0;
					var totRes = currRes;
					
		    		for (tile in tiles)
		    		{
			    		sum += tiles[tile].population;
						totRes += tiles[tile].resources;
			    		if (tiles[tile].type == 4 || tiles[tile].type < 3)
			    		{
				    		limit += .01;
				    		var chance = randRange(10000);
				    		if (chance == 0 && currType == 3)
				    		{
								that.Map.getTiles()[x][y].setType(4);
							}
			    		}
			    		if (tiles[tile].type == 8 && currPop >= .6)
			    		{
				    		tiles[tile].setType(3);
			    		}
						if (tiles[tile].type == 9)
						{
							citiesClose++;
						}
		    		}
					
					if (currPop > .5)
					{
	          			that.Map.getTiles()[x][y].life -= currPop/10;
					}
					
					if (currPop > 0 && currPop < .3 && sum < .5 && currRes > 50)
					{
						newPop += .01;
					}
					
					if (citiesClose == 0 && currBuilt > 10000 && currType != 5 && currType != 6)
					{
						that.Map.tiles[x][y].setType(9);
					}

		    		if (sum > 0 && sum <= 3)
		    		{
			    		newPop += Math.round(sum)/1000;
		    		}
					
		    		if (currPop >= limit)
		    		{
			    		newPop -= Math.abs(currPop-limit);
		    		}
					
					if (totRes > 0 && currPop > .2)
					{
						that.Map.getTiles()[x][y].built += totRes/1000;
					}
					
					if (currRes <= 0)
					{
						newPop -= .01;
					}					
					if(currPop <= 0)
					{
						that.Map.getTiles()[x][y].resources++;
					}

		    		// end calculate
		    		newPops[x][y] = newPop;
                }

            }

        }


        for (var x = 0; x < map_size; x++)
        {
            for (var y = 0; y < map_size; y++)
            {
                that.Map.getTiles()[x][y].population += newPops[x][y];
                if (that.Map.getTiles()[x][y].population < 0)
                {
	                that.Map.getTiles()[x][y].population = 0;
                }
                if (that.Map.getTiles()[x][y].life > 0)
                {
	            	that.Map.getTiles()[x][y].life -= that.Map.getTiles()[x][y].population;
	            }
            }

        }

    }

    this.Draw = function () 
	{
        this.Map.drawMap();
        this.Map.drawCord();
    }
    
    this.stop = function()
    {
	   	window.clearInterval(this.GameLoop);
	   	window.clearInterval(this.CheckMouseLoop);
	   	$('canvas#minimap').hide();
    }
}

function gameInit() 
{
	mapx = document.getElementById("gameCanvas").getAttribute("width")/tile_size;
	mapy = document.getElementById("gameCanvas").getAttribute("height")/tile_size;
    _canvas = document.getElementById("gameCanvas");
    _canvasContext = _canvas.getContext('2d');

    mousePos = {x: 0, y: 0};

    myGame = new Game;
    myGame.Initialize();
    var poop = setInterval(minimap(myGame.Map), 500);
    
    document.getElementById("makegraph").onmousedown = function()
    {
    	myGame.stop();
    	_canvasContext.fillStyle = "#FFF";
    	_canvasContext.fillRect(0, 0, width, height);
    	_canvasContext.beginPath();
    	var x = 0;
    	for (var i = 1; i <= width; i++)
    	{
    		y = height - PopScore[Math.round(i*myGame.turns/width)] * height/maxPop;
    		x = i;
	    	_canvasContext.lineTo(x, y);
    	}
    	_canvasContext.lineTo(x, height);
    	_canvasContext.closePath();
    	_canvasContext.stroke();
    	_canvasContext.fillStyle = "#000";
    	_canvasContext.fill();
    
    }
    document.getElementById("restart").onmousedown = function () 
	{
        myGame.stop();
        numClicks = 0;
        maxPop = 0;
        myGame.Initialize();
        minimap(myGame.Map);
		canvasx = 40;
		canvasy = 40;
	   	$('canvas#minimap').show();
    };

}