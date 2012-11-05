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