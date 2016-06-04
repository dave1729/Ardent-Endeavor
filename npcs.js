/**
 * 
 */
function NPC(game, x, y) {
	//this.animation = new Animation(spritesheet, 64, 64, 8, 0.07, 60, true, 1.0);
	this.game = game;
	this.x = x;
	this.y = y;
}

NPC.prototype = new Event();
NPC.prototype.constructor = NPC;

NPC.prototype.update = function () {
	this.screenX = this.x - gm.em.backgroundEntity.x;
	this.screenY = this.y - gm.em.backgroundEntity.y;
	Event.prototype.update.call(this);
}

NPC.prototype.directionTowardPlayer = function (entity) {
	var deltaX = gm.player.x - entity.x;
	var deltaY = gm.player.y - entity.y;
	if(Math.abs(deltaX) > Math.abs(deltaY)) {
		if(deltaX > 0) {
			entity.direction = "right";
		}
		else {
			entity.direction = "left";
		}
	}
	else {
		if(deltaY > 0) {
			entity.direction = "down";
		}
		else {
			entity.direction = "up";
		}
	}
}

NPC.prototype.draw = function () {
	// Visual Debugging of Event Locations
	//this.animation.drawEntity(this.game.clockTick, this.game.ctx, this.screenX, this.screenY);
	if (gm.hitBoxVisible) {
		gm.ctx.strokeStyle = "pink";
	    gm.ctx.strokeRect(this.hitBox.getScreenX(), this.hitBox.getScreenY(),
	    						 this.hitBox.width, this.hitBox.height);
	}
}

NPC.prototype.collisionTrigger = function (player, moveX, moveY) {
	console.log("NPC Collision: " + this.constructor.name);
	var pc = {x: player.hitBox.getX(), y: player.hitBox.getY(), width: player.hitBox.width, height: player.hitBox.height};
	var npc = {x: this.hitBox.getX(), y: this.hitBox.getY(), width: this.hitBox.width, height: this.hitBox.height};

	var xTestFail = false;
	var yTestFail = false;
	if (pc.x - moveX < npc.x + npc.width 
			&& pc.x - moveX + pc.width > npc.x 
			&& pc.y < npc.y + npc.height 
			&& pc.height + pc.y > npc.y) {
		yTestFail = true;
	}
	if (pc.x < npc.x + npc.width 
			&& pc.x + pc.width > npc.x 
			&& pc.y - moveY < npc.y + npc.height 
			&& pc.height + pc.y - moveY > npc.y) {
		xTestFail = true;
	}
	if (xTestFail && yTestFail) {
		player.x -= moveX;
		player.y -= moveY;
	} else if (xTestFail) {
		player.x -= moveX;
	} else if (yTestFail) {
		player.y -= moveY;
	}
	
}
NPC.prototype.story = function () {
	
}


/* +------------------------------------------+ */
/* |             ===  Billy  ===              | */
/* +------------------------------------------+ */
function Billy(x, y) {
	this.game = gm;
	this.animation = new Animation(gm.am.getAsset("./img/werewolf.png"), 
					 		TILE_SIZE, TILE_SIZE, 4, 0.20, 16, true, 1);
	this.x = x;
	this.y = y;
	this.screenX = this.x;
	this.screenY = this.y;
	this.storyStage = 1;
	this.hitBox = new CollisionBox(this, 10, 10, TILE_SIZE-20, TILE_SIZE-20);
}
Billy.prototype = new NPC();
Billy.prototype.constructor = Billy;

Billy.prototype.draw = function () {
	this.animation.drawEntity(gm.clockTick, gm.ctx, this.screenX, this.screenY);
	NPC.prototype.draw.call(this);
}
Billy.prototype.update = function () {
	NPC.prototype.update.call(this);
}
Billy.prototype.collisionTrigger = function (player, startX, startY) {
	NPC.prototype.collisionTrigger.call(this, player, startX, startY);
}
Billy.prototype.interactTrigger = function () {
	this.story();
}
Billy.prototype.story = function () {
	//console.log(this.storyStage);
	switch(this.storyStage) {
	case 1:
		gm.openDialogueBox(this.constructor.name, 
				"Chewbacca: A legendary Wookiee warrior and Han Solo’s " +
				"co-pilot aboard the Millennium Falcon, Chewbacca was part " +
				"of a core group of Rebels who restored freedom to the galaxy. " +
				"Known for his short temper and accuracy with a bowcaster, " +
				"Chewie also has a big heart -- and is unwavering in his loyalty " +
				"to his friends. He has stuck with Han through years of turmoil " +
				"that have changed both the galaxy and their lives.");
		this.storyStage = 2;
		break;
	case 2:
		gm.openDialogueBox(this.constructor.name, 
				"Why are you still talking to me?");
		this.storyStage = 3;
		break;
	case 3:
		console.log("get ready to open merchant page");
		gm.im.setAllFalse();
		gm.openMerchantMenu();
//		gm.openDialogueBox(this.constructor.name, 
//				"Please stop using me for your tests...");
		break;
	default:
		break;
			
	}
}

/* +------------------------------------------+ */
/* |             ===  Pirate Girl  ===              | */
/* +------------------------------------------+ */
function PirateGirl(x, y) {
	this.game = gm;
	this.animation = new Animation(gm.am.getAsset("./img/PirateGirl.png"), 
					 		TILE_SIZE, TILE_SIZE, 9, 0.20, 9, true, 1);
	this.x = x;
	this.y = y;
	this.direction = "down";
	this.walking = false;
	this.screenX = this.x;
	this.screenY = this.y;
	this.storyStage = 1;
	this.hitBox = new CollisionBox(this, 10, 10, TILE_SIZE-20, TILE_SIZE-20);
}
PirateGirl.prototype = new NPC();
PirateGirl.prototype.constructor = PirateGirl;

PirateGirl.prototype.draw = function (tick, ctx, x, y, entity) {
	this.elapsedTime += tick;
	if (this.animation.isDone()) {
		if (this.animation.loop) this.animation.elapsedTime = 0;
	}
	var frame = this.animation.currentFrame();
	var xindex = 0;
	var yindex = 0;
	xindex = frame % this.animation.sheetWidth;

	//Choosing character sprite from sheet
	if (this.walking === false) {
		xindex = 0;
	}
	
	if(this.direction === "up") {
		yindex = 8;
	}
	else if(this.direction === "down") {
		yindex = 10;
	}
	else if(this.direction === "left") {
		yindex = 9;
	}
	else if(this.direction === "right") {
		yindex = 11;
	}
	else {
		yindex = 10;
	}

	var screenPoint = gm.cam.getMyScreenXandY(this.x, this.y);
	
	gm.ctx.drawImage(this.animation.spriteSheet,
			xindex * this.animation.frameWidth, yindex * this.animation.frameHeight,  // source from sheet
			this.animation.frameWidth, this.animation.frameHeight,
			screenPoint.x, screenPoint.y,
			this.animation.frameWidth * this.animation.scale,
			this.animation.frameHeight * this.animation.scale);

	// Collision Box
	if (gm.hitBoxVisible) {
		ctx.strokeStyle = "yellow";
	    ctx.strokeRect(this.hitBox.getScreenX(), this.hitBox.getScreenY(),
	    		 	   this.hitBox.width, this.hitBox.height);
	}
}
PirateGirl.prototype.update = function () {
	NPC.prototype.directionTowardPlayer(this);
}
PirateGirl.prototype.collisionTrigger = function (player, startX, startY) {
	NPC.prototype.collisionTrigger.call(this, player, startX, startY);
}
PirateGirl.prototype.interactTrigger = function () {
	if(gm.player.tryRemoveItem("Pirate Hat")) {
		this.storyStage = 3;
		this.animation = new Animation(gm.am.getAsset("./img/PirateGirlWithPirateHat.png"), 
		 		TILE_SIZE, TILE_SIZE, 9, 0.20, 9, true, 1);
	}
	this.story();
}
PirateGirl.prototype.story = function () {
	//console.log(this.storyStage);
	switch(this.storyStage) {
	case 1:
		gm.openDialogueBox(this.constructor.name, 
				"Ship Captin: Please adventurer. My ship was overtaken by bandits. " +
				"I barely escaped with my life, and lost my favorite Hat. " +
				"If you can get all those bandits off my ship, I'll tell you a " +
				"valuable secret. To prove you have done it, return my favorite Hat to me.");
		this.storyStage = 2;
		break;
	case 2:
		gm.openDialogueBox(this.constructor.name, 
				"Why are you still standing here? Go get my Hat! If it makes you feel better, " +
				"pretend it's a quest.");
		break;
	case 3:
		gm.openDialogueBox(this.constructor.name, 
				"Oh thank you! I love this Hat! Ok, my secret is this... There is a tree in the " +
				"maze near the castle, where I hid the castle key. But beware, that castle while" +
				" full of treasure, is quite dangerous.");
		this.storyStage = 4;
		break;
	case 4:
		gm.openDialogueBox(this.constructor.name, 
				"Thank you again for getting those bandits off of my boat.");
		break;
	default:
		break;
			
	}
}