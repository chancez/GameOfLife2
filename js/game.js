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

mountains_snow = new Image();
mountains_snow.src = images.mountains_snow;

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
        }
    }(type);
    this.setType = function(newType)
    {
    	this.life = 1000;
	    this.type = newType;
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
                return mountain;
            case 6:
                return mountains_snow;
            case 7:
                return sand;
            case 8:
                return wasteland;
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
                _canvasContext.fillStyle = "rgba(255, 165 , 0, " + this.tiles[x][y].population/2 + ")";
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
        if (x_cord > map_size-1)
        {
	        x_cord = map_size -1;
        }
        if (y_cord > map_size-1)
        {
	        y_cord = map_size -1;
        }
		popTotal = 0;
        for (var x = 0; x < map_size; x++)
        {
	        for (var y = 0; y < map_size; y++)
	        {
		        popTotal += this.tiles[x][y].population;
	        }
        }
        if (popTotal > maxPop)
        {
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
		document.getElementById("gameText").innerHTML = ("Position: (" + x_cord + ", " + y_cord + "), Tile Population: " + Math.round(this.tiles[x_cord][y_cord].population*10) + 
        ", Total Population: " + Math.round(popTotal)) + ", # Clicks Remaining: " + poop;
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
			    		newPop += .1;
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
				    				newPops[tiles[tile].x][tiles[tile].y] += .1;
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

		    		if (sum >= 2)
		    		{
			    		newPop -= .2;
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
    	_canvasContext.stroke();
    }
    document.getElementById("restart").onmousedown = function () {
        myGame.stop();
        numClicks = 0;
        myGame.Initialize();
    };

}

function setBaseTile(rows,tileType) { //may be parameters (continent, tileType, tileProbComp, tileProbDec, originalTileType)
    var units;
    var tileProbDec;  //probability subtraction #
    var tileProbComp; //original prob
    var startPosX = randRange(map_size);
    var startPosY = randRange(map_size);

    switch(tileType){
        case 3:
            units = 25;
            tileProbDec = (randRange(20)+5)/100;
            tileProbComp = 0.95;
            break;
        case 4:
            units = 30;
            tileProbDec = (randRange(15)+5)/100;
            tileProbComp = 0.85;
            while(!(isLand(startPosX,startPosY,rows))) {
                startPosX = randRange(map_size);
                startPosY = randRange(map_size);
            }
            break;
        case 5:
            units = 18;
            tileProbDec = (randRange(5)+20)/100;
            tileProbComp = 0.65;
            while(!(isLand(startPosX,startPosY,rows))) {
                startPosX = randRange(map_size);
                startPosY = randRange(map_size);
            }
            break;
    }

    for (var i = 0; i<units; i++) {
        startPosX = randRange(map_size);
        startPosY = randRange(map_size);
        tileProbDec = (randRange(20)+5)/100;

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

//turns border land to sand and border water to shallow water
function updateSand(rows) {
    var waterID = 1;
    var waterNearID = 2;
    var landID = 3;
    var forestID = 4;
    var mountainID = 5;
    var mountainSnowID = 6;
    var sandID = 7;
    var snowyMount = randRange(map_size);

    //water to sand
    for (var y = 0; y < map_size; y++) 
        for (var x = 0; x < map_size; x++) 
            if (rows[x][y] === landID || rows[x][y] === forestID || rows[x][y] === mountainID) 
                if (checkSurround(rows, x, y, waterID, 3)) 
                    rows[x][y] = sandID;

    //Changes mountain to snowy is surrounded by a certain amount of mountains
    for (var y = 0; y < map_size; y++)
        for (var x = 0; x < map_size; x++)
            if (rows[x][y] === mountainID) {

                snowyMount = randRange(map_size);

                if (checkSurroundWithException(rows, x, y, mountainID, mountainSnowID, 8) && snowyMount > 33)
                    rows[x][y] = mountainSnowID;//tileFlood(x, y, 75, 25, mountainSnowID, rows);
            }

    for (var y = 0; y < map_size; y++)  // Sets water to waterNear if its suppose to be     <------------------------------------------------
        for (var x = 0; x < map_size; x++)
            if (rows[x][y] === waterID)
                for (var counter = 3; counter < 8; counter++)
                    if (counter != 6 && checkSurround(rows, x, y, counter, 1))
                        rows[x][y] = waterNearID;
}

function checkSurround(rows, x, y, chosenID, limit){    // Used to check is a tile is being touched by at least X amounts of A tiles

    var howManyWater = 0;

        if ((x + 1) < map_size){    // ONE
            if (rows[x + 1][y] === chosenID) {
                howManyWater++;
            }
        }

        if((x - 1) >= 0){   //  TWO
            if(rows[x - 1][y] === chosenID)
            {
                howManyWater++;
            }
        }

        if ((x - 1) >= 0 && (y - 1) > 0) {   // THREE
            if (rows[x - 1][y - 1] === chosenID) {
                howManyWater++;
            }
        }

        if((y - 1) >= 0) {  // FOUR
            if(rows[x][y - 1] === chosenID) {
                howManyWater++;
            }
        }

        if ((x + 1) < map_size && (y - 1) > 0) {    // FIVE
            if (rows[x + 1][y - 1] === chosenID) {
                howManyWater++;
            }
        }

        if ((x - 1) >= 0 && (y + 1) < map_size) {    // SIX
            if (rows[x - 1][y + 1] === chosenID) {
                howManyWater++;
            }
        }

        if ((y + 1) < map_size) {   // SEVEN
            if (rows[x][y + 1] === chosenID) {
                howManyWater++;
            }
        }

        if ((x + 1) < map_size && (y + 1) < map_size) { // EIGHT
            if (rows[x + 1][y + 1] === chosenID) {
                howManyWater++;
            }
        }

        if (howManyWater >= limit) {
            return true;
        }

        else {
            return false;
        }
}

function checkSurroundWithException(rows, x, y, chosenID, dontCareID,  limit){    // Used to check is a tile is being touched by at least X amounts of A tiles

    var howManyWater = 0;

        if ((x + 1) < map_size){    // ONE
            if (rows[x + 1][y] === chosenID || rows[x + 1][y] === dontCareID) {
                howManyWater++;
            }
        }

        if((x - 1) >= 0){   //  TWO
            if(rows[x - 1][y] === chosenID || rows[x - 1][y] === dontCareID)
            {
                howManyWater++;
            }
        }

        if ((x - 1) >= 0 && (y - 1) > 0) {   // THREE
            if (rows[x - 1][y - 1] === chosenID || rows[x - 1][y - 1] === dontCareID) {
                howManyWater++;
            }
        }

        if((y - 1) >= 0) {  // FOUR
            if(rows[x][y - 1] === chosenID || rows[x][y - 1] === dontCareID) {
                howManyWater++;
            }
        }

        if ((x + 1) < map_size && (y - 1) > 0) {    // FIVE
            if (rows[x + 1][y - 1] === chosenID || rows[x + 1][y - 1] === dontCareID) {
                howManyWater++;
            }
        }

        if ((x - 1) >= 0 && (y + 1) < map_size) {    // SIX
            if (rows[x - 1][y + 1] === chosenID | rows[x - 1][y + 1] === dontCareID) {
                howManyWater++;
            }
        }

        if ((y + 1) < map_size) {   // SEVEN
            if (rows[x][y + 1] === chosenID || rows[x][y + 1] === dontCareID) {
                howManyWater++;
            }
        }

        if ((x + 1) < map_size && (y + 1) < map_size) { // EIGHT
            if (rows[x + 1][y + 1] === chosenID || rows[x + 1][y + 1] === dontCareID) {
                howManyWater++;
            }
        }

        if (howManyWater >= limit) {
            return true;
        }

        else {
            return false;
        }
}
//checks if is land or not
var isLand = function (posX,posY,rows) {
    if (rows[posX][posY] === 3) {
        return true;
    }
    else {
        return false;
    }
}

function snowyMount() { //supposed to add s mountains, but is not working yet, need rows neighbor func
    var neighbors;
    var mount = 0;

    for(var i = 0; i < map_size; i++) {
        for(var j = 0; j < map_size; j++) {

            if(rows[i][j] === 5){
                neighbors = Map.getNeighbors[i][j];
                for(var k = 0; k < 8; k++) {
                    if(neighbors.t_left.type === 5)
                        mount++;
                    if(neighbors.top.type === 5)
                        mount++;
                    if(neighbors.t_right.type === 5)
                        mount++;
                    if(neighbors.left.type === 5)
                        mount++;
                    if(neighbors.right.type === 5)
                        mount++;
                    if(neighbors.b_left.type === 5)
                        mount++;
                    if(neighbors.bottom.type === 5)
                        mount++;
                    if(neighbors.b_left.type === 5)
                        mount++;
                    if(mount >= 4) {
                        Map.tiles(i,j).type === 6;
                    }
                }
            }
        }
    }
}


function minimap(map) {

    var minimap = document.getElementById('minimap');
    var mapCxt = minimap.getContext('2d');
    var xAxis = 0;
    var yAxis = 0;

    var minis = new Array();
    for (var i = 0; i < map_size; i++) {
        minis[i] = new Array();
        
        for(var j = 0; j < map_size; j++) {
            mapCxt.fillStyle = map.tiles[j][i].color;
            mapCxt.fillRect(xAxis+=2,yAxis,2,2);
        }
       xAxis-=200;
       yAxis+=2;
    }
}
