const TILE_SIZE = 64;
function GameManager(ctx, ctxUI)
{
    this.controlEntity = null;
    this.backgroundEntity = null;
    this.ctx = ctx;
    this.ctxUI = ctxUI;
    this.im = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.mouse = {
        x: 0,
        y: 0
    }
    this.hitBoxVisible = null;
    this.am = null; // AssetManager
    
    this.mm = null; // MapManager
    this.em = null; // EntityManager
    this.sm = null; // SceneManager
    this.ui = null; // UIManager
    this.timer = null;
    this.gamePaused = true;
    
}
GameManager.prototype.start = function() {
    this.init();
    this.am.queueDownload("./img/player.png");
    this.am.queueDownload("./img/GrassOnlyBackground.png");
    this.am.queueDownload("./img/collidable_background.png");
    this.am.queueDownload("./img/werewolf.png");
    this.am.queueDownload("./img/greenrage.png");
    this.am.queueDownload("./img/shark.png");
    this.am.queueDownload("./img/alienfirebird.png");
    this.am.queueDownload("./img/temple.jpg");
    this.am.downloadAll(() => {
        this.loop();
        this.initialize(new Player(this.am.getAsset("./img/player.png")), 1, 900, 900);
    })
}

/* loads the starting map and character's starting position. */
GameManager.prototype.initialize = function (player, mapid, destx, desty) {
	this.player = player;
	this.mm.initialize();
	this.loadMap(mapid, destx, desty);
	this.gamePaused = false;
}

GameManager.prototype.startInput = function (ctx) {
    console.log('Starting input');
    this.im.start(ctx);
    console.log('Input started');
}

GameManager.prototype.init = function () {
    this.am = new AssetManager();
    this.em = new EntityManager();
    this.im = new InputManager("Dungeon");
    this.ui = new UIManager();
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    this.disableInput = false;
    this.startInput(this.ctx);
    this.hitBoxVisible = true;
    
    this.mm = new MapManager();
    console.log('game initialized');
}
/* unloads the old map, then loads in the new map and all the entities */
GameManager.prototype.loadMap = function (mapid, destx, desty) {
	this.map = this.mm.getMap(mapid);
	console.log(mapid);
	this.em.removeAllEntities();
	this.player.x = destx;
	this.player.y = desty;
	
	this.em.addEntity(this.map.bgLayer);
	this.em.addEntity(this.player);
	this.em.addEntity(this.map.cLayer);
	
	//need logic for spawning enemies in spawn zones
	for (var i = 0; i < this.map.entities.length; ++i) {
		this.em.addEntity(this.map.entities[i]);
	}
    //debugger;
}
/* Loads battle scene, disabling overworld entities and controls */
GameManager.prototype.startBattle = function () {
	// Lets ignore this for now
	gm.em.cacheEntities();
	gm.em.removeAllEntities();
	
	// this.game.em.addEntity(map.bgLayer);
	// this.game.em.addEntity(map.cLayer);
	this.em.addEntity(new Grid(this))
	let c = new Cursor(this);
	this.em.addEntity(c);
	this.em.addEntity(new Battle(this, c));
	// let b = new Battle(this.game);
	// b.start();
	
	// needs more logic to add battle assets
	// pause overworld functions
}

/* Disables battle scene, loading regular functionality to overworld. */
GameManager.prototype.endBattle = function () {
	this.em.removeAllEntities();
	this.em.restoreEntities();
	// remove battle assets
	// resume overworld functions
}

/* Opens the game menu, switching canvas focus and keybinds */
GameManager.prototype.openGameMenu = function () {
	this.gamePaused = true;
	this.im.changeCurrentGroupTo("ui");
	this.startInput(this.ctxUI);
	// need to disable previous keys.
	document.getElementById("uiLayer").style.zIndex = "2";
}

GameManager.prototype.closeGameMenu = function () {
	this.gamePaused = false;
	this.im.changeCurrentGroupTo("Dungeon");
	this.startInput(this.ctx);
	document.getElementById("uiLayer").style.zIndex = "-1";
}

GameManager.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    if (!this.gamePaused) {
    	this.em.update();
    	this.click = undefined;
    	this.em.draw();
    } else {
    	this.ui.update();
    	this.click = undefined;
    	this.ui.draw();
    }
    
    requestAnimationFrame(this.loop.bind(this), this.ctx.canvas);
   //this.update();
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}