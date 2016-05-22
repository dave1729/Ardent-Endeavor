var gm = gm || {};

function Player(spritesheet) {
	this.spriteSquareSize = 64;
	this.scale = 1;
	//Animation: spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale
	this.animation = new Animation(spritesheet, this.spriteSquareSize, this.spriteSquareSize, 9, 0.1, 32, true, this.scale);
	this.regSpeed = 325;
	this.speedX = 0;
	this.speedY = 0;
	this.layer = 5;
	this.entityID = 1;
	this.ctx = gm.ctx;
	this.controls();
	this.interactRange = 5;
	
	// When changing the hitbox, also change x and y shift in draw collision box
	this.hitBox = new CollisionBox(this, 18, 34, this.spriteSquareSize-36, this.spriteSquareSize-36);
	Entity.call(this, 235, 215);
}

Player.prototype.init = function () {
	this.controls();
}

Player.prototype.controls = function () {
	//starting controls
	gm.im.addInput(new Input("up", 'w'));
    gm.im.addInput(new Input("down", 's'));
    gm.im.addInput(new Input("left", 'a'));
    gm.im.addInput(new Input("right", 'd'));
    gm.im.addInput(new Input("menu", 'i'));
    gm.im.addInput(new Input("interact", 'e'));
	
    //turns player follow on and off with 't'
	gm.im.addInput(new Input("screentest", 't'));
	
    gm.im.addInput(new Input("interact", 'e'));
    
    //start with camera following Player
    gm.cam.follow(this);
}

Player.prototype.entityCollisionCheck = function (startX, startY) {
	var rectMain = {x: this.hitBox.getX(), y: this.hitBox.getY(), width: this.hitBox.width, height: this.hitBox.height}
	
	gm.checkMapCollision({x: this.hitBox.getScreenX(), y: this.hitBox.getScreenY(), width: this.hitBox.width, height: this.hitBox.height}, checkCollisionData);
	
	function checkCollisionData(wasCollision, pixelPoint, imageData) {
		if (wasCollision) {
			// NOTE: Collision needs to be refined so diagonal movement can be done.
			gm.player.x = startX;
			gm.player.y = startY;
		}
	}
	
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
				gm.em.entities[i].collisionTrigger(this, startX, startY);
			} 
		}
		//console.log("ran check");
	}
}

Player.prototype.interactFind = function () {
	var rectMain = {x: this.hitBox.getX() - this.interactRange, y: this.hitBox.getY() - this.interactRange, width: this.hitBox.width + this.interactRange*2, height: this.hitBox.height + this.interactRange*2}
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
				console.log("Interacted with " + gm.em.entities[i].constructor.name);
				gm.em.entities[i].interactTrigger(this);
			} 
		}
		//console.log("ran check");
	}
}

Player.prototype.draw = function (ctx) {
	this.animation.drawPlayer(gm.clockTick, ctx, this.x, this.y, this);
}

Player.prototype.update = function () {
	if (this.animation.elapsedTime < this.animation.totalTime) {
		var currentAdjust = gm.clockTick * this.speed;
		var startX = this.x;
		var startY = this.y;
		if (gm.im.checkInput("menu")) {
			gm.openGameMenu();
			gm.im.currentgroup.input_list[4].isPressed = false;
		}
		else if (gm.im.checkInput("interact")) {
			this.interactFind();
		}
		else if(gm.im.checkInput("up") && gm.im.checkInput("left")) {
			this.speedY = -1 * this.regSpeed * sqrtOneHalf;
			this.speedX = -1 * this.regSpeed * sqrtOneHalf;
		}
		else if(gm.im.checkInput("up") && gm.im.checkInput("right")) {
			this.speedY = -1 * this.regSpeed * sqrtOneHalf;
			this.speedX = this.regSpeed * sqrtOneHalf;
		}
		else if(gm.im.checkInput("down") && gm.im.checkInput("left")) {
			this.speedY = this.regSpeed * sqrtOneHalf;
			this.speedX = -1 * this.regSpeed * sqrtOneHalf;
		}
		else if(gm.im.checkInput("down") && gm.im.checkInput("right")) {
			this.speedY = this.regSpeed * sqrtOneHalf;
			this.speedX = this.regSpeed * sqrtOneHalf;
		}
		else if(gm.im.checkInput("up")) {
			this.speedY = -1 * this.regSpeed;
		}
		else if(gm.im.checkInput("down")) {
			this.speedY = this.regSpeed;
		}
		else if(gm.im.checkInput("left")) {
			this.speedX = -1 * this.regSpeed;
		}
		else if(gm.im.checkInput("right")) {
			this.speedX = this.regSpeed;
		}
		
		//screen test allows to switch between following player and not with 't'
		if(gm.im.checkInput("screentest")) {
			//Still Works If you need to Test Something by pressing 'T'
		}
		
		if(!(gm.im.checkInput("up") || gm.im.checkInput("down"))) {
				this.speedY = 0;
		}
		if(!(gm.im.checkInput("left") || gm.im.checkInput("right"))) {
				this.speedX = 0;
		}
		var newX = this.x + gm.clockTick * this.speedX;
		var newY = this.y + gm.clockTick * this.speedY;

		//dungeon/8 = half a visible screen, 0.5 = character scale ratio
		if(newX > 0 && newX < dungeonWidth - 64) {
			this.x += gm.clockTick * this.speedX;
		}
		if(newY > 0 && newY < dungeonHeight - 64) {
			this.y += gm.clockTick * this.speedY;
		}

		// COLLISION
		this.entityCollisionCheck(startX, startY);
	}
}