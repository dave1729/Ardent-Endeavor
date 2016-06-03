/**
 * 
 */
function Gadget(x, y) {
	//this.animation = new Animation(spritesheet, 64, 64, 8, 0.07, 60, true, 1.0);
	this.x = x;
	this.y = y;
}

Gadget.prototype = new Event();
Gadget.prototype.constructor = Gadget;

Gadget.prototype.update = function () {
	this.screenX = this.x - gm.em.backgroundEntity.x;
	this.screenY = this.y - gm.em.backgroundEntity.y;
	Event.prototype.update.call(this);
}

Gadget.prototype.draw = function () {
	// Visual Debugging of Event Locations
	//this.animation.drawEntity(this.game.clockTick, this.game.ctx, this.screenX, this.screenY);
	if (gm.hitBoxVisible) {
		gm.ctx.strokeStyle = "lime";
	    gm.ctx.strokeRect(this.hitBox.getScreenX(), this.hitBox.getScreenY(),
	    						 this.hitBox.width, this.hitBox.height);
	}
}

Gadget.prototype.collisionTrigger = function (player, startX, startY) {
	console.log("Gadget Collision: " + this.constructor.name);
	var pc = {x: player.hitBox.getX(), y: player.hitBox.getY(), width: player.hitBox.width, height: player.hitBox.height};
	var npc = {x: this.hitBox.getX(), y: this.hitBox.getY(), width: this.hitBox.width, height: this.hitBox.height};

	//needs refinement
	
	if (pc.x < npc.x + npc.width || pc.x + pc.width > npc.x) {
		player.x = startX;
	}
	if (pc.y < npc.y + npc.height || pc.y + pc.height > npc.y) {
		player.y = startY;
	}
	
}



/* +------------------------------------------+ */
/* |             ===  Chest  ===              | */
/* +------------------------------------------+ */
function Chest(x, y, chestType, item, quantity) {
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
	this.animation = new Animation(gm.am.getAsset("./img/chest.png"), 
					 		32, 48, 1, 0.06, 4, false, 1);
	this.chestType = chestType; // 0, 1, or 2
	this.x = x;
	this.y = y;
	this.screenX = this.x;
	this.screenY = this.y;
	this.state = 1;
	this.item = item;
	this.quantity = quantity;
	// 1 - Closed; 2 - Opening; 3 - Open
	this.hitBox = new CollisionBox(this, 2, 22, TILE_SIZE-36, TILE_SIZE-42);
}
Chest.prototype = new Gadget();
Chest.prototype.constructor = Chest;

Chest.prototype.draw = function () {
	this.animation.drawChest(gm.clockTick, gm.ctx, this.screenX, this.screenY,
					this.chestType, this.state);
	Gadget.prototype.draw.call(this);
}
Chest.prototype.update = function () {
	if (this.state === 2 && this.animation.isDone())
	{
		gm.openDialogueBox(null,
				"You found " + this.quantity + " " + this.item.toString());
		gm.player.inventory.addItem(this.item, this.quantity);
		this.state = 3;
	}
	Gadget.prototype.update.call(this);
}
Chest.prototype.collisionTrigger = function (player, startX, startY) {
	Gadget.prototype.collisionTrigger.call(this, player, startX, startY);
}
Chest.prototype.interactTrigger = function () {
	if (this.state === 1) {
		this.state = 2;
	} else if (this.state === 3) {
		gm.openDialogueBox(null,
				"Chest is empty");
	}
}

Animation.prototype.drawChest = function (tick, ctx, x, y, column, state) {
	if(gm.cam.isVisible(this)) {
		var screenPoint = gm.cam.getMyScreenXandY(x, y);
		
		switch(state) {
		case 1:
			ctx.drawImage(this.spriteSheet,
					column * this.frameWidth, 0 * this.frameHeight,
					this.frameWidth, this.frameHeight,
					screenPoint.x, screenPoint.y,
					this.frameWidth * this.scale,
					this.frameHeight * this.scale);
			break;
		case 2:
			this.elapsedTime += tick;
			var frame = this.currentFrame();
			
			ctx.drawImage(this.spriteSheet,
					column * this.frameWidth, frame * this.frameHeight,
					this.frameWidth, this.frameHeight,
					screenPoint.x, screenPoint.y,
					this.frameWidth * this.scale,
					this.frameHeight * this.scale);	
			break;
		case 3:
			ctx.drawImage(this.spriteSheet,
					column * this.frameWidth, 3 * this.frameHeight,
					this.frameWidth, this.frameHeight,
					screenPoint.x, screenPoint.y,
					this.frameWidth * this.scale,
					this.frameHeight * this.scale);
			break;
		}
	}
}


/* +------------------------------------------+ */
/* |              ===  Door  ===              | */
/* +------------------------------------------+ */
function Door(x, y, doorType, isNewMap, destMapid, destx, desty) {
	this.isNewMap = isNewMap;
	this.destMapid = destMapid;
	this.destx = destx;
	this.desty = desty;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
	this.animation = new Animation(gm.am.getAsset("./img/doors.png"), 
					 		32, 64, 1, 0.1, 4, false, 1);
	this.doorType = doorType; // 0, 1, or 2
	this.x = x;
	this.y = y;
	this.screenX = this.x;
	this.screenY = this.y;
	this.state = 1;
	// 1 - Closed; 2 - Opening; 3 - Open
	this.hitBox = new CollisionBox(this, 0, 0, 32, 64);
}
Door.prototype = new Gadget();
Door.prototype.constructor = Door;

Door.prototype.draw = function () {
	this.animation.drawChest(gm.clockTick, gm.ctx, this.screenX, this.screenY,
					this.doorType, this.state);
	Gadget.prototype.draw.call(this);
}
Door.prototype.update = function () {
	if (this.state === 2 && this.animation.isDone()) {
		// Teleport
		this.state = 1;
		this.animation.elapsedTime = 0;
		if (this.isNewMap) {
			gm.loadMap(this.destMapid, this.destx, this.desty);
		} else {
			gm.player.x = this.destx;
			gm.player.y = this.desty;
			this.state = 1;
		}
		gm.em.backgroundEntity.update();
		gm.cam.jumpToByMid(this.destx, this.desty);
		gm.cam.follow(gm.player);
		
	}
	Gadget.prototype.update.call(this);
}

Door.prototype.collisionTrigger = function (player, startX, startY) {
	Gadget.prototype.collisionTrigger.call(this, player, startX, startY);
}

Door.prototype.interactTrigger = function () {
	if (this.state === 1) {
		this.state = 2;
	} else if (this.state === 3) {
		
	}
}

