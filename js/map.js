function Tile(x, y, type)
{
    this.x = x;
    this.y = y;
    this.type = type;
    this.population = 0;
	var that = this;
    this.setType = function(newType)
    {
    	this.life = 1000;
		this.built = 0;
	    this.type = newType;
		var that = this;
	    this.img = function(type)
		{
			switch(type)
			{
				case 1:
					that.resources = 500;
					return water_far;
				case 2:
					that.resources = 500;
					return water_near;
				case 3:
					that.resources = 200;
					return grass;
				case 4:
					that.resources = 500;
					return forest;
				case 5:
					that.resources = 300;
					return mountain;
				case 6:
					that.resources = 300;
					return mountains_snow;
				case 7:
					that.resources = 100;
					return sand;
				case 8:
					that.resources = 0;
					return wasteland;
				case 9:
					that.resources = 1000;
					return city;
        	}
    	}(newType);
		this.color = function(type)
		{
			switch (type)
			{
				case 1:
					return "blue";
				case 2:
					return "teal";
				case 3:
					return "green";
				case 4:
					return "darkgreen";
				case 5:
					return "grey";
				case 6:
					return "silver";	
				case 7:
					return "yellow";
				case 8:
					return "brown";
				case 9:
					return "black";
			}
		}(newType);
    }
    this.setType(type);

}

function Map(tileArray)
{
    var that = this;
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
                _canvasContext.fillStyle = "rgba(255, 165 , 0, " + this.tiles[x][y].population/1 + ")";
                _canvasContext.fillRect(i*tile_size, j*tile_size, tile_size, tile_size);
                j++;
            }
            j = 0;
            i++;
        }
    }

    this.drawCord = function () {
        var mouse_x = Math.floor(mousePos.x / 32);
        var mouse_y = Math.floor(mousePos.y / 32);
        var x_cord = mouse_x + camerax;
        var y_cord = mouse_y + cameray;
        if (x_cord > map_size - 1) {
            x_cord = map_size - 1;
        }
        if (y_cord > map_size - 1) {
            y_cord = map_size - 1;
        }
        popTotal = 0;
        for (var x = 0; x < map_size; x++) {
            for (var y = 0; y < map_size; y++) {
                popTotal += this.tiles[x][y].population;
            }
        }
        if (popTotal > maxPop) {
            maxPop = popTotal;
        }

        /*
        _canvasContext.fillStyle = "#ffffe0";
        _canvasContext.font = "15px Arial";
        _canvasContext.fillText("Position: (" + x_cord + ", " + y_cord + "), Tile Population: " + Math.round(this.tiles[x_cord][y_cord].population*10) + 
        ", Total Population: " + Math.round(popTotal)
        , 10 , 470)
        */
   
        var poop = 3 - numClicks;
        document.getElementById("gameText").innerHTML = ("Position: (" + x_cord + ", " + y_cord + "), Tile Population: " + Math.round(this.tiles[x_cord][y_cord].population * 10) + " ,Highest Pop Attained: " + highestPop +
        ", Total Population: " + Math.round(popTotal)) + ", # Clicks Remaining: " + poop;

        if(Math.round(popTotal) > highestPop)
            highestPop = Math.round(popTotal); 
    }

    this.getNeightbors = function(x,y) {
        var neighbors = {
        }

        if (x != 0){
            //checkleft
            neighbors.left = that.tiles[x-1][y];
            if (y != 0) {
                //check top left
                neighbors.t_left = that.tiles[x-1][y-1];
            }
        }
        if (x !=  99){
            //checkright
            neighbors.right = that.tiles[x+1][y];
            if (y != 0){
                //check topright
                neighbors.t_right = that.tiles[x+1][y-1];
            }
            if (y != 99){
                //check bottom right
                neighbors.b_right = that.tiles[x+1][y+1];
            }
        }
        if (y != 0) {
            //checktop
            neighbors['top'] = that.tiles[x][y-1]; //array notation because top might be reserved
        }
        if (y != 99) {
            //check bottom
            neighbors.bottom = that.tiles[x][y+1];
            if (x != 0){
                //check bottom left
                neighbors.b_left = that.tiles[x-1][y+1]
            }
        }
        return neighbors;
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
    setBaseTile(rows,3); //land creation
    setBaseTile(rows,4); //growing forests
    setBaseTile(rows,5); //erecting mountains

    updateSand(rows); //sandy edges

    return rows;
}