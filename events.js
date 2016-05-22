/**
 * 
 */


/**
 * An event is an invisible entity in the game world. When the
 * player controlled character collides with the event entity,
 * it will trigger an event in game. The action performed will
 * depend on the type of event triggered.
 */
function Event(game, x, y, w, h) {
	this.w = w;
	this.h = h;
	this.x = x;
	this.y = y;
	this.layer = 1;
	this.hitBox = new CollisionBox(this, 0, 0, w, h);
	Entity.call(this, game, x, y);
}

Event.prototype = new Entity();
Event.prototype.constructor = Event;

Event.prototype.update = function () {
	Entity.prototype.update.call(this);
}

Event.prototype.draw = function () {
	// Visual Debugging of Event Locations
	if (gm.hitBoxVisible) {
		gm.ctx.strokeStyle = "red";
		gm.ctx.strokeRect(this.hitBox.getScreenX(), this.hitBox.getScreenY(),
				 this.hitBox.width, this.hitBox.height);
	}
}
Event.prototype.interactTrigger = function (player) {
	// Default is do nothing
}


/**
 * Map teleport is an event that will change the background
 * image(s) of the game world and move the character to the
 * correct coordinates.
 */
function MapTeleportEvent(game, x, y, w, h, destMapid, destx, desty) {
	this.game = game;
	this.destMapid = destMapid;
	this.destx = destx;
	this.desty = desty;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.hitBox = new CollisionBox(this, 0, 0, w, h);
}

MapTeleportEvent.prototype = new Event();
MapTeleportEvent.prototype.constructor = MapTeleportEvent;

MapTeleportEvent.prototype.update = function () {
	//this.screenX = this.x - gm.cam.leftX;
	//this.screenY = this.y - gm.cam.topY;
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
	//console.error("Map to teleport to: " + this.destMapid);
	//gm.cam.stopFollow();
	gm.loadMap(this.destMapid, this.destx, this.desty);
	gm.em.backgroundEntity.update();
	//gm.cam.follow(gm.player);
	gm.cam.jumpToByMid(this.destx, this.desty);
}


/* +------------------------------------------+ */
/* |             ===  You Win ===             | */
/* +------------------------------------------+ */
/**
 * 
 */
function YouWinEvent(game, x, y, w, h) {
	this.game = game;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.hitBox = new CollisionBox(this, 0, 0, w, h);
}

YouWinEvent.prototype = new Event();
YouWinEvent.prototype.constructor = YouWinEvent;

YouWinEvent.prototype.update = function () {
	//this.screenX = this.x - gm.cam.leftX;
	//this.screenY = this.y - gm.cam.topY;
	Event.prototype.update.call(this);
}

YouWinEvent.prototype.draw = function () {
	Event.prototype.draw.call(this);
}

/**
 * A mapteleport event will teleport the playable character to
 * the given mapid and coordinates.
 */
YouWinEvent.prototype.collisionTrigger = function (player) {
	gm.openDialogueBox(null,
		"You win, congratulations!!!");
}
Event.prototype.interactTrigger = function (player) {
	gm.openDialogueBox(null,
		"You win, congratulations!!!");
}


