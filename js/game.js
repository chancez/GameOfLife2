var Game = {}

Game.fps = 30;
Game.initalize = function() {
    this.entries = [];
    this.context = $("#gamearea").getContext("2d");
}
