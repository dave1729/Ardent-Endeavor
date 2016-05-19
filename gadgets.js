/**
 * 
 */
function Gadget(game, x, y) {
	//this.animation = new Animation(spritesheet, 64, 64, 8, 0.07, 60, true, 1.0);
	this.game = game;
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
function Chest(game, x, y, chestType, item) {
	this.game = game;
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
	// 1 - Closed; 2 - Opening; 3 - Open
	this.hitBox = new CollisionBox(this, 2, 22, TILE_SIZE-36, TILE_SIZE-42);
}
Chest.prototype = new NPC();
Chest.prototype.constructor = Chest;

Chest.prototype.draw = function () {
	this.animation.drawChest(gm.clockTick, gm.ctx, this.screenX, this.screenY,
					this.chestType, this.state);
	Gadget.prototype.draw.call(this);
}
Chest.prototype.update = function () {
	if (this.state === 2 && this.animation.isDone()) {
		gm.openDialogueBox(this.constructor.name,
				"You found a " + this.item);
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
		gm.openDialogueBox(this.constructor.name,
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

