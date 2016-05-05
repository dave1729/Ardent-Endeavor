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
	this.screenX = x;
	this.screenY = y;
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
	    gm.ctx.strokeRect(this.screenX, this.screenY, this.w, this.h);
	}
}


/**
 * Map teleport is an event that will change the background
 * image(s) of the game world and move the character to the
 * correct coordinates.
 */
function MapTeleportEvent(game, x, y, w, h, destMapid, destx, desty) {
	this.destMapid = destMapid;
	this.destx = destx;
	this.desty = desty;
	Event.call(this, game, 0, x, y, w, h);
}

MapTeleportEvent.prototype = new Event();
MapTeleportEvent.prototype.constructor = MapTeleportEvent;

MapTeleportEvent.prototype.update = function () {
	this.screenX = this.x - gm.em.backgroundEntity.x;
	this.screenY = this.y - gm.em.backgroundEntity.y;
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
	gm.loadMap(this.destMapid, this.destx, this.desty);
	gm.em.backgroundEntity.update();
}


