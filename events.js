/**
 * 
 */


/**
 * An event is an invisible entity in the game world. When the
 * player controlled character collides with the event entity,
 * it will trigger an event in game. The action performed will
 * depend on the type of event triggered.
 */
function Event(game, mapid, x, y, w, h) {
	this.mapid = mapid;
	this.w = w;
	this.h = h;
	this.hitBoxVisible = true;
	Entity.call(this, game, x, y);
}

Event.prototype = new Entity();
Event.prototype.constructor = Event;

Event.prototype.update = function () {
	
	Entity.prototype.update.call(this);
}

Event.prototype.draw = function () {
	// Visual Debugging of Event Locations
	if (this.hitBoxVisible) {
		this.game.ctx.strokeStyle = "red";
	    this.game.ctx.strokeRect(this.x, this.y, this.w, this.h);
	}
}


/**
 * Map teleport is an event that will change the background
 * image(s) of the game world and move the character to the
 * correct coordinates.
 */
function MapTeleportEvent(game, mapid, x, y, w, h, destMapid, destx, desty) {
	this.destMapid = destMapid;
	this.destx = destx;
	this.desty = desty;
	Event.call(this, game, mapid, x, y, w, h);
}

MapTeleportEvent.prototype = new Event();
MapTeleportEvent.prototype.constructor = MapTeleportEvent;

MapTeleportEvent.prototype.update = function () {
	//console.log(this.x);
	//console.log(this.y);
	Event.prototype.update.call(this);
}

MapTeleportEvent.prototype.draw = function () {
	Event.prototype.draw.call(this);
}

/**
 * A mapteleport event will teleport the playable character to
 * the given mapid and coordinates.
 */
MapTeleportEvent.prototype.collisionTrigger = function (player) {
	player.x = this.destx;
	player.y = this.desty;
	//Arrow.prototype.update.call(player);
}


/**
 * An Enemy is an overworld enemy. When the player collides with an
 * enemy, it will delete that event from the current map and transfer
 * the player to the battle scene.
 */
function Enemy(game, mapid, x, y, w, h, spritesheet) {
	this.animation = new Animation(spritesheet, 70, 56, 8, 0.07, 60, true, 1.0);
	this.hitBoxVisible = true;
	Event.call(this, game, mapid, x, y, w, h);
}

Enemy.prototype = new Event();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
	Event.prototype.update.call(this);
}

Enemy.prototype.draw = function () {
	// Visual Debugging of Event Locations
	this.animation.drawFrameEnemy(this.game.clockTick, this.game.ctx, this.x, this.y);

	if (this.hitBoxVisible) {
		this.game.ctx.strokeStyle = "cyan";
	    this.game.ctx.strokeRect(this.x, this.y, this.w, this.h);
	}
}

Enemy.prototype.collisionTrigger = function (player) {
	console.log("Enemy Collision");
	// Put logic here for transition to battle scene.
}





function Enemy2(game, mapid, x, y, w, h, spritesheet) {
	this.animation = new Animation(spritesheet, 142, 96, 4, 0.1, 16, true, 1.0);
	this.hitBoxVisible = true;
	Event.call(this, game, mapid, x, y, w, h);
}

Enemy2.prototype = new Event();
Enemy2.prototype.constructor = Enemy2;

Enemy2.prototype.update = function () {
	//Event.prototype.update.call(this);
}

Enemy2.prototype.draw = function () {
	// Visual Debugging of Event Locations
	this.animation.drawFrameEnemy(this.game.clockTick, this.game.ctx, this.x, this.y);

	if (this.hitBoxVisible) {
		this.game.ctx.strokeStyle = "cyan";
	    this.game.ctx.strokeRect(this.x, this.y, this.w, this.h);
	}
}

Enemy2.prototype.collisionTrigger = function (player) {
	console.log("Enemy Collision");
	// Put logic here for transition to battle scene.
}







function Enemy3(game, mapid, x, y, w, h, spritesheet) {
	this.animation = new Animation(spritesheet, 81, 86, 2, 0.15, 4, true, 1.0);
	this.hitBoxVisible = true;
	Event.call(this, game, mapid, x, y, w, h);
}

Enemy3.prototype = new Event();
Enemy3.prototype.constructor = Enemy3;

Enemy3.prototype.update = function () {
	//Event.prototype.update.call(this);
}

Enemy3.prototype.draw = function () {
	// Visual Debugging of Event Locations
	this.animation.drawFrameEnemy(this.game.clockTick, this.game.ctx, this.x, this.y);

	if (this.hitBoxVisible) {
		this.game.ctx.strokeStyle = "cyan";
	    this.game.ctx.strokeRect(this.x, this.y, this.w, this.h);
	}
}

Enemy3.prototype.collisionTrigger = function (player) {
	console.log("Enemy Collision");
	// Put logic here for transition to battle scene.
}

















Animation.prototype.drawFrameEnemy = function (tick, ctx, x, y) {
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


