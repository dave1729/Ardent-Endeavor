
//type this at the top of other files to get the reference to the global gamemanager object
//var gm = gm || {};

// this would be our main now or something like it
var gm = new GameManager();
gm.start(); //idk something like this

//Here is the game manager the game manager has a reference to all managers
//everything that needs to be used in another manager should be in a manager
function GameManager() //this would  be scene manager now.
{
    this.t = new Timer(); //did sort hand for now can change for readibility
    this.am = new AssetManager();
    this.im = new InputManager();
    this.mm = new MapManager();
}

//these are just some methods that might be useful you can change them if you want
GameManager.prototype.pause = function (params) {
    
}

GameManager.prototype.loadScene = function (params) {
   //load assets
   //load inputs
   //load map
}

GameManager.prototype.saveScene = function (params) {
    
}

// Treat this as if it were in a different files
// an example of using gm
//var gm = gm || {};

function inputexamle() {
    if(gm.im.pressed['a']) // maybe input would work like this????
    {
        console.log("bananas")
    }
}