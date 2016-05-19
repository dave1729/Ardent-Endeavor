const testingMode = false;
const sqrtOneHalf = 0.70711;
const dungeonWidth = 2048;
const dungeonHeight = 1920;
const screenToMapRatioX= 0.75;
const screenToMapRatioY= 0.75;

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.spriteSheet = spriteSheet;
	this.frameWidth = frameWidth;
	this.frameDuration = frameDuration;
	this.frameHeight = frameHeight;
	this.sheetWidth = sheetWidth;
	this.frames = frames;
	this.totalTime = frameDuration * frames;
	this.elapsedTime = 0;
	this.loop = loop;
	this.scale = scale;
}

Animation.prototype.currentFrame = function () {
	return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
	return (this.elapsedTime >= this.totalTime);
}

Animation.prototype.drawEntity = function (tick, ctx, x, y) {
	//only draw if it's gonna be vivible
	if(gm.cam.isVisible(this)) {
		this.elapsedTime += tick;
		if (this.isDone()) {
			if (this.loop) this.elapsedTime = 0;
		}
		var frame = this.currentFrame();
		var xindex = 0;
		var yindex = 0;
		xindex = frame % this.sheetWidth;
		yindex = Math.floor(frame / this.sheetWidth);

		var screenPoint = gm.cam.getMyScreenXandY(x, y);
		
		ctx.drawImage(this.spriteSheet,
				xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
				this.frameWidth, this.frameHeight,
				screenPoint.x, screenPoint.y,
				this.frameWidth * this.scale,
				this.frameHeight * this.scale);		
//		ctx.drawImage(this.spriteSheet,
//				xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
//				this.frameWidth, this.frameHeight,
//				x - gm.cam.leftX, y - gm.cam.topY,
//				this.frameWidth * this.scale,
//				this.frameHeight * this.scale);
	}
}

Animation.prototype.updateEntity = function (entity) {
	if(entity.game.controlEntity.x !== null) {
		//dungeon/8 = half a visible screen, 0.5 = character scale ratio
		entity.screenX = entity.x - gm.cam.leftX;
		entity.screenY = entity.y - gm.cam.topY;
	}
}

//no inheritance
function Background(game, spritesheet) {
	this.entityID = 0;
	this.spritesheet = spritesheet;
	this.game = gm;
	this.layer = 1;
	this.control = false;
	Entity.call(this, 0, 0);
};

Background.prototype = Object.create(Entity.prototype);
Background.prototype.constructor = Background;
// Background.prototype

Background.prototype.draw = function (ctx) {
	//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	var width = Math.floor(gm.canvas.width);
	var heigth = Math.floor(gm.canvas.height);
	ctx.drawImage(this.spritesheet, gm.cam.leftX, gm.cam.topY, gm.cam.width, gm.cam.height, 0, 0, gm.cam.width, gm.cam.height);
};

Background.prototype.update = function () {

};

//no inheritance
function Collidable_background(game, spritesheet) {
	this.entityID = 3;
	this.spritesheet = spritesheet;
	this.game = gm;
	this.layer = 2;
	Entity.call(this, 0, 0);
};

Collidable_background.prototype = Object.create(Entity.prototype);
Collidable_background.prototype.constructor = Collidable_background;

Collidable_background.prototype.draw = function (ctx) {
	//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	var width = Math.floor(gm.canvas.width);
	var heigth = Math.floor(gm.canvas.height);
	ctx.drawImage(this.spritesheet, gm.cam.leftX, gm.cam.topY, gm.cam.width, gm.cam.height,
			0, 0, gm.cam.width, gm.cam.height);
};

Collidable_background.prototype.update = function () {

};

Animation.prototype.drawPlayer = function (tick, ctx, x, y, entity) {

	this.elapsedTime += tick;
	if (this.isDone()) {
		if (this.loop) this.elapsedTime = 0;
	}
	var frame = this.currentFrame();
	var xindex = 0;
	var yindex = 0;
	xindex = frame % this.sheetWidth;

	//Choosing character sprite from sheet
	if(gm.im.checkInput("up") && gm.im.checkInput("left")) {
		yindex = 8;
	}
	else if(gm.im.checkInput("up") && gm.im.checkInput("right")) {
		yindex = 8;
	}
	else if(gm.im.checkInput("down") && gm.im.checkInput("left")) {
		yindex = 10;
	}
	else if(gm.im.checkInput("down") && gm.im.checkInput("right")) {
		yindex = 10;
	}
	else if(gm.im.checkInput("up")) {
		yindex = 8;
	}
	else if(gm.im.checkInput("down")) {
		yindex = 10;
	}
	else if(gm.im.checkInput("left")) {
		yindex = 9;
	}
	else if(gm.im.checkInput("right")) {
		yindex = 11;
	}
	else {
		xindex = 0;
		yindex = 6;
	}

	var tempX = x;
	var tempY = y;
	var centerX = Math.floor(gm.canvas.width/2  - (64 / 2));
	var centerY = Math.floor(gm.canvas.height/2 - (64 / 2));

	
	//If he's not being followed by the camera, just draw him like everyone else is drawn.
	if(gm.cam.currentEntity !== entity) {
		var screenPoint = gm.cam.getMyScreenXandY(entity.x, entity.y);
		tempX = screenPoint.x;
		tempY = screenPoint.y;
	}
	else {//draw him all special and junk
		if (x > centerX && x < (screenToMapRatioX * dungeonWidth) + centerX) {
			tempX = centerX;
		}
		else if (x >= (screenToMapRatioX * dungeonWidth) + centerX) {
			tempX = x - (screenToMapRatioX * dungeonWidth);
		}
	
		if(y > centerY && y < (screenToMapRatioY * dungeonHeight) + centerY) {
			tempY = centerY;
		}
		else if (y >= (screenToMapRatioY * dungeonHeight) + centerY) {
			tempY = y - (screenToMapRatioY * dungeonHeight);
		}
	}
	
	ctx.drawImage(this.spriteSheet,
			xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
			this.frameWidth, this.frameHeight,
			tempX, tempY,
			this.frameWidth * this.scale,
			this.frameHeight * this.scale);

	//this.animation.drawPlayer(this.game.clockTick, this.ctx, this.x, this.y, this);

	// Collision Box
	if (gm.hitBoxVisible) {
		ctx.strokeStyle = "yellow";
	    ctx.strokeRect(0 + entity.hitBox.getScreenX() , 0 + entity.hitBox.getScreenY(),
	    				entity.hitBox.width, entity.hitBox.height);
	}
	
	//ctx.strokeStyle = "yellow";
	//ctx.strokeRect(tempX, tempY, 64, 64);
}





// function initGame(ctx, AM){

// }

// AM.downloadAll(function () {

// 	var ctx = canvas.getContext("2d");
// 	let gm = Object.create(GameManager.prototype);
// 	gm.update();
// 	// var gameEngine = new GameEngine();
// 	// gameEngine.init(ctx, AM, gameEngine);
// 	// gameEngine.start();
	
// 	// gameEngine.sm.startBattle();

// 	// gameEngine.sm.initialize(new Player(gameEngine, AM.getAsset("./img/player.png")),
// 	// 		1, 900, 900);

// //	var background = new Background(gameEngine, AM.getAsset("./img/GrassOnlyBackground.png"));
// //	var cursor = new Cursor(gameEngine);
// //	gameEngine.addEntity(background);
// //	gameEngine.addEntity(new Battle(gameEngine, cursor))
// //	gameEngine.addEntity(new Grid(gameEngine, background))
// //	gameEngine.addEntity(cursor)

// //	gameEngine.addEntity(new Player(gameEngine, AM.getAsset("./img/player.png")));
// //	gameEngine.addEntity(new Collidable_background(gameEngine, AM.getAsset("./img/collidable_background.png")));
// //	gameEngine.addEntity(new Werewolf(gameEngine, AM.getAsset("./img/werewolf.png")));

// //	gameEngine.addEntity(new MapTeleportEvent(gameEngine, 1, 400, 400, 50, 50, 1, 800, 800));
// //	gameEngine.addEntity(new MapTeleportEvent(gameEngine, 1, 400, 100, 50, 50, 1, 100, 100));
// //	gameEngine.addEntity(new Enemy(gameEngine, 1, 64, 64, 64, 64, AM.getAsset("./img/greenrage.png")));
// //	gameEngine.addEntity(new Enemy2(gameEngine, 1, 64, 128, 64, 64, AM.getAsset("./img/shark.png")));
// //	gameEngine.addEntity(new Enemy3(gameEngine, 1, 64, 256, 64, 64, AM.getAsset("./img/alienfirebird.png")));

// 	console.log("All Done!");
// });
var gm = gm || {};
window.addEventListener('load', () => {
	var canvas = document.getElementById("gameWorld");
	canvas.focus();
	var ctx = canvas.getContext("2d");
	
	var canvasUI = document.getElementById("uiLayer");
	var ctxUI = canvasUI.getContext("2d");
	
	var canvasCollision = document.getElementById("collisionMask");
	var ctxCol = canvasCollision.getContext("2d");
	
	gm = new GameManager(ctx, ctxUI, ctxCol, canvas);
	gm.start();

});