const testingMode = false;
const sqrtOneHalf = 0.70711;
const dungeonWidth = 2048;
const dungeonHeight = 1920;
const screenToMapRatio = 0.75;

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
	if((x + this.frameWidth) > 0 && x < dungeonWidth/4 &&
			(y + this.frameHeight) > 0 && y < dungeonHeight/4) {
		this.elapsedTime += tick;
		if (this.isDone()) {
			if (this.loop) this.elapsedTime = 0;
		}
		var frame = this.currentFrame();
		var xindex = 0;
		var yindex = 0;
		xindex = frame % this.sheetWidth;
		yindex = Math.floor(frame / this.sheetWidth);

		ctx.drawImage(this.spriteSheet,
				xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
				this.frameWidth, this.frameHeight,
				x, y,
				this.frameWidth * this.scale,
				this.frameHeight * this.scale);
	}
}

Animation.prototype.updateEntity = function (entity) {
	if(entity.game.controlEntity.x !== null) {
		//dungeon/8 = half a visible screen, 0.5 = character scale ratio
		entity.screenX = entity.x - entity.game.backgroundEntity.x;
		entity.screenY = entity.y - entity.game.backgroundEntity.y;
	}
}

//no inheritance
function Background(game, spritesheet) {
	this.x = 0;
	this.y = 0;
	this.entityID = 0;
	this.spritesheet = spritesheet;
	this.game = game;
	this.layer = 1;
	this.control = false;
	this.ctx = game.ctx;
};

Background.prototype.draw = function () {
	//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	var width = Math.floor(dungeonWidth/4);
	var heigth = Math.floor(dungeonHeight/4);
	this.ctx.drawImage(this.spritesheet,this.x, this.y, width, heigth,
			0, 0, width, heigth);
};

Background.prototype.update = function () {
	if(gm.em.controlEntity.x !== null) {
		//dungeon/8 = half a visible screen, 0.5 = character scale ratio
		var newX = gm.em.controlEntity.x - Math.floor(dungeonWidth/8  - (64 / 2));
		var newY = gm.em.controlEntity.y - Math.floor(dungeonHeight/8 - (64 / 2));

		//dungeonWidth/4 one visible screen width
		if(newX >= 0 && newX <= (dungeonWidth - dungeonWidth/4)) {
			this.x = newX;
		}
		if(newY >= 0 && newY <= (dungeonHeight - dungeonHeight/4) ) {
			this.y = newY;
		}
	}
	else {
		alert("Alert: Board Not updated, when Arrow was moved.");
	}
	Entity.prototype.update.call(this);
};

//no inheritance
function Collidable_background(game, spritesheet) {
	this.x = 0;
	this.y = 0;
	this.entityID = 3;
	this.spritesheet = spritesheet;
	this.game = game;
	this.layer = 2;
	this.ctx = game.ctx;
};

Collidable_background.prototype.draw = function () {
	//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	var width = Math.floor(dungeonWidth/4);
	var heigth = Math.floor(dungeonHeight/4);
	this.ctx.drawImage(this.spritesheet,this.x, this.y, width, heigth,
			0, 0, width, heigth);
};

Collidable_background.prototype.update = function () {
	if(gm.em.controlEntity.x !== null) {
		//dungeon/8 = half a visible screen, 0.5 = character scale ratio
		var newX = gm.em.controlEntity.x - Math.floor(dungeonWidth/8  - (64 / 2));
		var newY = gm.em.controlEntity.y - Math.floor(dungeonHeight/8 - (64 / 2));

		//dungeonWidth/4 one visible screen width
		if(newX >= 0 && newX <= (dungeonWidth - dungeonWidth/4)) {
			this.x = newX;
		}
		if(newY >= 0 && newY <= (dungeonHeight - dungeonHeight/4) ) {
			this.y = newY;
		}
	}
	else {
		alert("Alert: Board Not updated, when Arrow was moved.");
	}
	Entity.prototype.update.call(this);
};

//function Werewolf(game, spritesheet) {
//	this.animation = new Animation(spritesheet, 64, 64, 4, 0.20, 16, true, 1);
//	this.x = 300;
//	this.y = 300;
//	this.screenX = this.x;
//	this.screenY = this.y;
//	this.entityID = 4;
//	this.layer = 3;
//	this.speed = 0;
//	this.game = game;
//	this.ctx = game.ctx;
//}
//
//Werewolf.prototype.draw = function () {
//	this.animation.drawEntity(this.game.clockTick, this.ctx, this.screenX, this.screenY);
//}
//
//Werewolf.prototype.update = function () {
//	//Updates the entities screenX and screenY using it's x and y against the background
//	this.animation.updateEntity(this);
//
//	Entity.prototype.update.call(this);
//}





Animation.prototype.drawPlayer = function (tick, ctx, x, y, entity) {

	this.elapsedTime += tick;
	if (this.isDone()) {
		if (this.loop) this.elapsedTime = 0;
	}
	var frame = this.currentFrame();
	var xindex = 0;
	var yindex = 0;
	xindex = frame % this.sheetWidth;

	if(entity.im.checkInput("up") && entity.im.checkInput("left")) {
		yindex = 8;
	}
	else if(entity.im.checkInput("up") && entity.im.checkInput("right")) {
		yindex = 8;
	}
	else if(entity.im.checkInput("down") && entity.im.checkInput("left")) {
		yindex = 10;
	}
	else if(entity.im.checkInput("down") && entity.im.checkInput("right")) {
		yindex = 10;
	}
	else if(entity.im.checkInput("up")) {
		yindex = 8;
	}
	else if(entity.im.checkInput("down")) {
		yindex = 10;
	}
	else if(entity.im.checkInput("left")) {
		yindex = 9;
	}
	else if(entity.im.checkInput("right")) {
		yindex = 11;
	}
	else {
		yindex = 10;
	}

	var tempX = x;
	var tempY = y;
	var centerX = Math.floor(dungeonWidth/8  - (64 / 2));
	var centerY = Math.floor(dungeonHeight/8 - (64 / 2));

	//centering circle for testing
	if(testingMode) {
		ctx.arc(dungeonWidth/8,dungeonHeight/8,20,0,2*Math.PI);
		ctx.stroke();
	}

	if (x > centerX && x < (screenToMapRatio * dungeonWidth) + centerX) {
		tempX = centerX;
	}
	else if (x >= (screenToMapRatio * dungeonWidth) + centerX) {
		tempX = x - (screenToMapRatio * dungeonWidth);
	}

	if(y > centerY && y < (screenToMapRatio * dungeonHeight) + centerY) {
		tempY = centerY;
	}
	else if (y >= (screenToMapRatio * dungeonHeight) + centerY) {
		tempY = y - (screenToMapRatio * dungeonHeight);
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
	    ctx.strokeRect(tempX + entity.hitBox.offsetX , tempY + entity.hitBox.offsetY,
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
	
	gm = new GameManager(ctx, ctxUI);
	gm.start();

});