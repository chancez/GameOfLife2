function Game() {
    width = document.getElementById("gameCanvas").getAttribute("width");
    height = document.getElementById("gameCanvas").getAttribute("height");

    var that = this;

    this.Initialize = function () {
    	this.turns = 0;
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
        	if (numClicks < 3)
        	{
	            mousePos= getMousePos(event);
	            var x = Math.floor(mousePos.x/tile_size) + camerax;
	            var y = Math.floor(mousePos.y/tile_size) + cameray;
	            if (that.Map.getTiles()[x][y].population < .9 && that.Map.getTiles()[x][y].type > 2)
	            {
	                that.Map.getTiles()[x][y].population += .1
	            }
	        	numClicks++;
	        }
        }

        var doKeyDown = function(event) {
            alert(event.keyCode);
        }

        _canvas.addEventListener( "keydown", doKeyDown, true);



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
        //console.log("x: " + x + " y: " + y + " camerax: " + camerax + " cameray: " + cameray);

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

                if (that.Map.getTiles()[x][y].life <= 0 && currType != 8)
                {
	                that.Map.getTiles()[x][y].setType(8);
                }
                else if (currType == 1 || currType == 2)
                {
                    newPop -= currPop;
                    newPop += .1;
                }
                else
                {
		    		var limit = .9;
		            if (currType == 7 || currType == 5 || currType == 6)
		            {
		                newPop -= currPop/2;
		            }
		            if (currType == 8)
		            {
			            newPop -= currPop*2;
		            }
		            if (currType == 4 && currPop > 1.1)
		            {
			        	that.Map.tiles[x][y].setType(3);
		            }
		            if (currType == 3)
		            {
			            limit = 1.3;
		            }
                    var tiles = that.Map.getNeightbors(x,y);

		    		if (currPop < .5 && currPop > 0)
		    		{
			    		newPop += .01;
		    		}

		    		if (currPop > .4)
		    		{
		    			for (tile in tiles)
		    			{
				    		var chance = randRange(3);
				    		if (chance == 0)
				    		{
			    				if (tiles[tile].type != 1 && tiles[tile].type != 2)
			    				{
				    				newPops[tiles[tile].x][tiles[tile].y] += .01;
				    			}
				    		}
		    			}
		    		}

		    		var sum = 0;
		    		for (tile in tiles)
		    		{
			    		sum += tiles[tile].population;
			    		if (tiles[tile].type == 4 || tiles[tile].type < 3)
			    		{
				    		limit += .2;
				    		tiles[tile].life += Math.round(tiles[tile].population*10);
			    		}
			    		if (tiles[tile].type == 8 && currPop >= 1.6)
			    		{
				    		tiles[tile].setType(3);
			    		}
		    		}

		    		if (sum >= 3)
		    		{
			    		newPop -= .1;
		    		}

		    		if (currPop >= limit)
		    		{
			    		newPop -= .2;
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
	            that.Map.getTiles()[x][y].life -= newPops[x][y];
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

    this.Draw = function () {
        this.Map.drawMap();
        this.Map.drawCord();
    }
    
    this.stop = function()
    {
	   	window.clearInterval(this.GameLoop);
	   	window.clearInterval(this.CheckMouseLoop);
    }
}

function gameInit() {
	mapx = document.getElementById("gameCanvas").getAttribute("width")/tile_size;
	mapy = document.getElementById("gameCanvas").getAttribute("height")/tile_size;
    _canvas = document.getElementById("gameCanvas");
    _canvasContext = _canvas.getContext('2d');

    mousePos = {x: 0, y: 0};

    myGame = new Game;
    myGame.Initialize();
    minimap(myGame.Map);
    document.getElementById("makegraph").onmousedown = function()
    {
    	myGame.stop();
    	_canvasContext.fillStyle = "#FFF";
    	_canvasContext.fillRect(0, 0, width, height);
    	_canvasContext.beginPath();
    	for (var i = 1; i <= width; i++)
    	{
    		var y = height - PopScore[Math.round(i*myGame.turns/width)] * height/maxPop;
	    	_canvasContext.lineTo(i, y);
    	}
    	_canvasContext.lineTo(width, height);
    	_canvasContext.lineTo(0, height);
    	_canvasContext.fill();
    	_canvasContext.stroke();
    
    }
    document.getElementById("restart").onmousedown = function () {
        myGame.stop();
        numClicks = 0;
        maxPop = 0;
        myGame.Initialize();
        minimap(myGame.Map);
    };

}