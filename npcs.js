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

NPC.prototype.draw = function () {
	// Visual Debugging of Event Locations
	//this.animation.drawEntity(this.game.clockTick, this.game.ctx, this.screenX, this.screenY);
	if (gm.hitBoxVisible) {
		gm.ctx.strokeStyle = "pink";
	    gm.ctx.strokeRect(this.hitBox.getScreenX(), this.hitBox.getScreenY(),
	    						 this.hitBox.width, this.hitBox.height);
	}
}

NPC.prototype.collisionTrigger = function (player, startX, startY) {
	console.log("NPC Collision: " + this.constructor.name);
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
NPC.prototype.story = function () {
	
}



/* +------------------------------------------+ */
/* |             ===  Billy  ===              | */
/* +------------------------------------------+ */
function Billy(game, x, y) {
	this.game = game;
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