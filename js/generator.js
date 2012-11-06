
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

    for (var y = 0; y < map_size; y++)  // Sets water to waterNear if its suppose to be
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

function minimap(map) 
{
    var minimap = document.getElementById('minimap');
    var mapCxt = minimap.getContext('2d');
    var xAxis = 0;
    var yAxis = 0;

    var minis = new Array();
    for (var i = 0; i < map_size; i++)
	{
        minis[i] = new Array();
        
        for(var j = 0; j < map_size; j++) 
		{
            mapCxt.fillStyle = map.getTiles()[j][i].color;
            mapCxt.fillRect(xAxis,yAxis,2,2);
			if (map.getTiles()[j][i].population >= 0.4)
			{
				mapCxt.fillStyle = "rgba(255, 165 , 0, " + map.getTiles()[j][i].population/1 + ")";
           	 	mapCxt.fillRect(xAxis,yAxis,2,2);
			}
			xAxis+=2;
        }
       xAxis-=200;
       yAxis+=2;
    }
	mapCxt.strokeStyle = "#000";
	mapCxt.strokeRect(camerax*2, cameray*2, mapx*2, mapy*2);
}
