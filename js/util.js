//utility functions for game.js

//gives a random number between 1 and the map_size
function randRange(int map_size) 
{
	var randomNum = Math.floor(Math.random()*map_size)+1;
	return randomNum;
}