/**
 * An Enemy is an overworld enemy. When the player collides with an
 * enemy, it will delete that event from the current map and transfer
 * the player to the battle scene.
 */
function Enemy(game, x, y) {
	//this.animation = new Animation(spritesheet, 64, 64, 8, 0.07, 60, true, 1.0);
	this.game = game;
	this.x = x;
	this.y = y;
}

Enemy.prototype = new Event();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
//	this.screenX = this.x - gm.em.backgroundEntity.x;
//	this.screenY = this.y - gm.em.backgroundEntity.y;
	Event.prototype.update.call(this);
}

Enemy.prototype.draw = function () {
	// Visual Debugging of Event Locations
	//this.animation.drawEntity(this.game.clockTick, this.game.ctx, this.screenX, this.screenY);
	if (gm.hitBoxVisible) {
		gm.ctx.strokeStyle = "cyan";
	    gm.ctx.strokeRect(this.hitBox.getScreenX(), this.hitBox.getScreenY(),
	    						 this.hitBox.width, this.hitBox.height);
	}
}

Enemy.prototype.collisionTrigger = function (player) {
	console.log("Enemy Collision: " + this.constructor.name);
	// Put logic here for transition to battle scene.
	gm.startBattle(this);
}



/* +------------------------------------------+ */
/* |           ===  Werewolf  ===             | */
/* +------------------------------------------+ */
function Werewolf(game, x, y) {
	this.game = game;
	this.animation = new Animation(gm.am.getAsset("./img/werewolf.png"), 
					 		TILE_SIZE, TILE_SIZE, 4, 0.20, 16, true, 1);
	this.x = x;
	this.y = y;
	this.hitBox = new CollisionBox(this, 10, 10, TILE_SIZE-20, TILE_SIZE-20);
}
Werewolf.prototype = new Enemy();
Werewolf.prototype.constructor = Werewolf;

Werewolf.prototype.draw = function () {
	this.animation.drawEntity(gm.clockTick, gm.ctx, this.x, this.y);
	Enemy.prototype.draw.call(this);
}
Werewolf.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
Werewolf.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}




/* +------------------------------------------+ */
/* |             ===  Green  ===              | */
/* +------------------------------------------+ */
function Green(game, x, y) {
	this.game = game;
	this.animation = new Animation(gm.am.getAsset("./img/greenrage.png"),
							TILE_SIZE, TILE_SIZE, 8, 0.07, 60, true, 1.0);
	this.x = x;
	this.y = y;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
}
Green.prototype = new Enemy();
Green.prototype.constructor = Green;

Green.prototype.draw = function () {
	this.animation.drawEntity(gm.clockTick, gm.ctx, this.x, this.y);
	Enemy.prototype.draw.call(this);
}
Green.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
Green.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}




/* +------------------------------------------+ */
/* |             ===  Shark  ===              | */
/* +------------------------------------------+ */
function Shark(game, x, y) {
	this.game = game;
	this.animation = new Animation(gm.am.getAsset("./img/shark.png"),
							TILE_SIZE, TILE_SIZE, 4, 0.1, 16, true, 1.0);
	this.x = x;
	this.y = y;
	this.hitBox = new CollisionBox(this, 13, 10, TILE_SIZE-20, TILE_SIZE-20);
}
Shark.prototype = new Enemy();
Shark.prototype.constructor = Shark;

Shark.prototype.draw = function () {
	this.animation.drawEntity(gm.clockTick, gm.ctx, this.x, this.y);
	Enemy.prototype.draw.call(this);
}
Shark.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
Shark.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}



/* +------------------------------------------+ */
/* |              ===  Fire  ===              | */
/* +------------------------------------------+ */
function Fire(game, x, y, spritesheet) {
	this.game = game;
	this.animation = new Animation(gm.am.getAsset("./img/alienfirebird.png"),
							TILE_SIZE, TILE_SIZE, 2, 0.15, 4, true, 1.0);
	this.x = x;
	this.y = y;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-20);
}
Fire.prototype = new Enemy();
Fire.prototype.constructor = Fire;

Fire.prototype.draw = function () {
	this.animation.drawEntity(gm.clockTick, gm.ctx, this.x, this.x);
	Enemy.prototype.draw.call(this);
}
Fire.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
Fire.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}
