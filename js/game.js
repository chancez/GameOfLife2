function Game() {
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
        var tileType = null;
        var landLocX = new Array();
        var landLocY = new Array();
        var landProb = [33, 66, 99];
        var landProbGen;
        var waterID = 1;
        var sandID = 2;
        var landID = 3;
        var mountID = 4;
        var forrestID = 5;
        var startPosX = Math.floor(Math.random() * 9);
        var startPosY = Math.floor(Math.random() * 9);
        var tileProb = null;
        var tileProbComp = .75;
        var tileType = null;
        tile newTile = null;
 
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
 
/*
*RULES
*water -> land
*border land -> sand
*land -> foreest/moutain
*border mountain -> wasteland
*as you draw a continent decrease the percentage by 1/4 per border.
(sizes 1, 8, 16) 
*/
