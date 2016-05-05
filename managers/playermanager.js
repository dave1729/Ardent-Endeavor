var gm = gm || {};

function Player(spritesheet) {
	this.spriteSquareSize = 64;
	this.scale = 1;
	//Animation: spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale
	this.animation = new Animation(spritesheet, this.spriteSquareSize, this.spriteSquareSize, 9, 0.1, 32, true, this.scale);
	this.x = 235;
	this.y = 215;
	this.regSpeed = 325;
	this.speedX = 0;
	this.speedY = 0;
	this.im = gm.im;
	this.layer = 4;
	this.entityID = 1;
	this.ctx = gm.ctx;
	this.controls();
	// When changing the hitbox, also change x and y shift in draw collision box
	this.hitBox = new CollisionBox(this, 18, 34, this.spriteSquareSize-36, this.spriteSquareSize-36);
}

Player.prototype.controls = function () {
	this.im.addInput(new Input("up", 'w'));
    this.im.addInput(new Input("down", 's'));
    this.im.addInput(new Input("left", 'a'));
    this.im.addInput(new Input("right", 'd'));
}

Player.prototype.entityCollisionCheck = function () {
	var rectMain = {x: this.hitBox.getX(), y: this.hitBox.getY(), width: this.hitBox.width, height: this.hitBox.height}
	//console.log(rectMain);
	var i;
	for (i = 0; i < gm.em.entities.length; ++i) {
		if (gm.em.entities[i] instanceof Event) {
			var rectOther = {x: gm.em.entities[i].hitBox.getX(),
					y: gm.em.entities[i].hitBox.getY(),
					width: gm.em.entities[i].hitBox.width,
					height: gm.em.entities[i].hitBox.height}

			if (rectMain.x < rectOther.x + rectOther.width 
					&& rectMain.x + rectMain.width > rectOther.x 
					&& rectMain.y < rectOther.y + rectOther.height 
					&& rectMain.height + rectMain.y > rectOther.y) { 
				//console.log("COLLISION DETECTED OMG");
				gm.em.entities[i].collisionTrigger(this);
			} 
		}
		//console.log("ran check");
	}
}

Player.prototype.draw = function () {
	this.animation.drawPlayer(gm.clockTick, this.ctx, this.x, this.y, this);
}

Player.prototype.update = function () {
	if (this.animation.elapsedTime < this.animation.totalTime) {
		var currentAdjust = gm.clockTick * this.speed;

		if(this.im.checkInput("up") && this.im.checkInput("left")) {
			this.speedY = -1 * this.regSpeed * sqrtOneHalf;
			this.speedX = -1 * this.regSpeed * sqrtOneHalf;
		}
		else if(this.im.checkInput("up") && this.im.checkInput("right")) {
			this.speedY = -1 * this.regSpeed * sqrtOneHalf;
			this.speedX = this.regSpeed * sqrtOneHalf;
		}
		else if(this.im.checkInput("down") && this.im.checkInput("left")) {
			this.speedY = this.regSpeed * sqrtOneHalf;
			this.speedX = -1 * this.regSpeed * sqrtOneHalf;
		}
		else if(this.im.checkInput("down") && this.im.checkInput("right")) {
			this.speedY = this.regSpeed * sqrtOneHalf;
			this.speedX = this.regSpeed * sqrtOneHalf;
		}
		else if(this.im.checkInput("up")) {
			this.speedY = -1 * this.regSpeed;
		}
		else if(this.im.checkInput("down")) {
			this.speedY = this.regSpeed;
		}
		else if(this.im.checkInput("left")) {
			this.speedX = -1 * this.regSpeed;
		}
		else if(this.im.checkInput("right")) {
			this.speedX = this.regSpeed;
		}
		
		if(!(this.im.checkInput("up") || this.im.checkInput("down") ||
		     this.im.checkInput("left") || this.im.checkInput("right"))) {
			this.speedX = 0;
			this.speedY = 0;
		}

		var newX = this.x + gm.clockTick * this.speedX;
		var newY = this.y + gm.clockTick * this.speedY;

		//attempting to read new layer as collidable layer
//		var collidable = null;
//		for (var i = 0; i < this.game.entities.length; i++) {
//		if(this.game.entities[i].layer === 2) {
//		collidable = this.entities[i];
//		}
//		}

//		var index = (newY*dungeonWidth + newX) * 4;
//		var alpha = 0;

//		var imgData = collidable.spritesheet.getImageData(0, 0, dungeonWidth, dungeonHeight);

//		alpha = imgData.data[index+3];

//		if(alpha > 0) {
//		alert(alpha);
//		}

		//dungeon/8 = half a visible screen, 0.5 = character scale ratio
		if(newX > 0 && newX < dungeonWidth - 64) {
			this.x += gm.clockTick * this.speedX;
		}
		if(newY > 0 && newY < dungeonHeight - 64) {
			this.y += gm.clockTick * this.speedY;
		}

		// COLLISION
		this.entityCollisionCheck();
	}
	Entity.prototype.update.call(this);
}