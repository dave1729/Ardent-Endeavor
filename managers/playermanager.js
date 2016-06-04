var gm = gm || {};

function Player(spritesheet) {
	this.spriteSquareSize = 64;
	this.scale = 1;
	this.gold = 0;
	//Animation: spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale
	this.animation = new Animation(spritesheet, this.spriteSquareSize, this.spriteSquareSize, 9, 0.1, 32, true, this.scale);
	this.regSpeed = 175;
	this.speedX = 0;
	this.speedY = 0;
	this.layer = 5;
	this.entityID = 1;
	this.interactRange = 5;
	this.inventory = new Inventory();
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
    gm.im.addInput(new Input("menu", 'q'));
    gm.im.addInput(new Input("interact", 'e'));
	
    //turns player follow on and off with 't'
	gm.im.addInput(new Input("screentest", 't'));
	
    gm.im.addInput(new Input("interact", 'e'));
    
    //start with camera following Player
    gm.cam.follow(this);
}

Player.prototype.entityCollisionCheck = function (moveX, moveY) {
	
	// Left and Right collision
	var revertX = false;
	if (moveX != 0) {
		gm.player.y -= moveY;
		// Check pixel collision with environment
		
		if (moveX < 0) {
			// only get data for left side
			imgData = gm.ctxCol.getImageData(this.hitBox.getScreenX(), this.hitBox.getScreenY(),
					1, this.hitBox.height);
		} else {
			// only get data for right side
			imgData = gm.ctxCol.getImageData(this.hitBox.getScreenX()+this.hitBox.width, this.hitBox.getScreenY(),
					1, this.hitBox.height);
		}
		var incY = Math.floor(this.hitBox.height / COLLISION_ACCURACY);
		for (var r = 0; r < this.hitBox.height; r += incY) {
			if ( imgData.data[(0 + r * imgData.width) * 4 + 3] > 50 ) {
				revertX = true;
            }
		}
		if ( imgData.data[(0 + (this.hitBox.height-1) * imgData.width) * 4 + 3] > 50 ) {
			revertX = true;
        }
		gm.player.y += moveY;
	}
	
	
	var revertY = false;
	if (moveY != 0) {
		gm.player.x -= moveX;
		if (moveY < 0) {
			// only get data for left side
			imgData = gm.ctxCol.getImageData(this.hitBox.getScreenX(), this.hitBox.getScreenY(),
					this.hitBox.width, 1);
		} else {
			// only get data for right side
			imgData = gm.ctxCol.getImageData(this.hitBox.getScreenX(), this.hitBox.getScreenY()+this.hitBox.height,
					this.hitBox.width, 1);
		}
		var incX = Math.floor(this.hitBox.width / COLLISION_ACCURACY);
		for (var c = 0; c < this.hitBox.width; c += incX) {
			if ( imgData.data[(c + 0 * imgData.width) * 4 + 3] > 50 ) {
				revertY = true;
            }
		}
		if ( imgData.data[((this.hitBox.width-1) + (0) * imgData.width) * 4 + 3] > 50 ) {
			revertY = true;
        }
		gm.player.x += moveX;
	}
	if (revertY) {
		gm.player.y -= moveY;
	}

	if (revertX) {
		gm.player.x -= moveX;
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
				gm.em.entities[i].collisionTrigger(this, moveX, moveY);
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

Player.prototype.tryRemoveItem = function (itemName) {
	var initialInventorySize = this.inventory.items.length;
	for(var i = 0; i < initialInventorySize; i++) {
		if(this.inventory.items[i].name === itemName) {
			this.inventory.items.splice(i, 1);
			if(initialInventorySize === this.inventory.items.length) {
				console.log("In Player Manager, Splice in hasItem function Did not reduce list properly.");
			}
			return true;
		}
	}
	return false;
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
			gm.im.addGroup("cameracontrol");
			gm.im.addInput(new Input("upc", 'w'));
		    gm.im.addInput(new Input("downc", 's'));
		    gm.im.addInput(new Input("leftc", 'a'));
		    gm.im.addInput(new Input("rightc", 'd'));
		    gm.im.addInput(new Input("screentestoff", 't'));
		}
		else if (gm.im.checkInput("screentestoff")) {
			gm.im.addGroup("Dungeon");
			this.controls();
		}
		
		var cameraSpeed = 2;
		if(gm.im.checkInput("upc") && gm.im.checkInput("leftc")) {
			gm.cam.jumpToByCorner(gm.cam.leftX - cameraSpeed, gm.cam.topY - cameraSpeed);
		}
		else if(gm.im.checkInput("upc") && gm.im.checkInput("rightc")) {
			gm.cam.jumpToByCorner(gm.cam.leftX + cameraSpeed, gm.cam.topY - cameraSpeed);
		}
		else if(gm.im.checkInput("downc") && gm.im.checkInput("leftc")) {
			gm.cam.jumpToByCorner(gm.cam.leftX - cameraSpeed, gm.cam.topY + cameraSpeed);
		}
		else if(gm.im.checkInput("downc") && gm.im.checkInput("rightc")) {
			gm.cam.jumpToByCorner(gm.cam.leftX + cameraSpeed, gm.cam.topY + cameraSpeed);
		}
		else if(gm.im.checkInput("upc")) {
			gm.cam.jumpToByCorner(gm.cam.leftX, gm.cam.topY - cameraSpeed);
		}
		else if(gm.im.checkInput("downc")) {
			gm.cam.jumpToByCorner(gm.cam.leftX, gm.cam.topY + cameraSpeed);
		}
		else if(gm.im.checkInput("leftc")) {
			gm.cam.jumpToByCorner(gm.cam.leftX - cameraSpeed, gm.cam.topY);
		}
		else if(gm.im.checkInput("rightc")) {
			gm.cam.jumpToByCorner(gm.cam.leftX + cameraSpeed, gm.cam.topY);
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
		this.entityCollisionCheck(this.x - startX, this.y - startY);
	}
}