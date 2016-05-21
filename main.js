const testingMode = false;
const sqrtOneHalf = 0.70711;
const dungeonWidth = 2048;
const dungeonHeight = 1920;
const screenToMapRatioX= 0.75;
const screenToMapRatioY= 0.75;

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale, row) {
	this.spriteSheet = spriteSheet;
	this.frameWidth = frameWidth;
	this.frameDuration = frameDuration;
	this.frameHeight = frameHeight;
	this.sheetWidth = sheetWidth;
	this.frames = frames;
	this.yindex = 0;
	this.totalTime = frameDuration * frames;
	this.elapsedTime = 0;
	this.loop = loop;
	this.scale = scale;
	this.row = row;
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
		var yindex = this.yindex;
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

	var screenPoint = gm.cam.getMyScreenXandY(entity.x, entity.y);
	
	ctx.drawImage(this.spriteSheet,
			xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
			this.frameWidth, this.frameHeight,
			screenPoint.x, screenPoint.y,
			this.frameWidth * this.scale,
			this.frameHeight * this.scale);

	// Collision Box
	if (gm.hitBoxVisible) {
		ctx.strokeStyle = "yellow";
	    ctx.strokeRect(0 + entity.hitBox.getScreenX() , 0 + entity.hitBox.getScreenY(),
	    				entity.hitBox.width, entity.hitBox.height);
	}
}
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