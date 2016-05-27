/*
 * Enemy List
 * =============================
 * Bandit (humanoid animal)
 * BirdMonster
 * FlyingBug
 * Devil
 * ThreeHeadedDog
 * Kraken
 * LizardMan
 * Goblin
 * Mercenary (humanoid animal)
 * Naga
 * Ogre
 * Slime
 * Snake03 (3 headed snake)
 * Snake04 (looks like a coutal)
 * StoneMonster
 * TreeMonster
 * UndeadCreeper
 * UndeadJacket
 * Zombie
 * Skeleton
 * Lich
 * ===============================
 */

/**
 * An Enemy is an overworld enemy. When the player collides with an
 * enemy, it will delete that event from the current map and transfer
 * the player to the battle scene.
 */
function Enemy(x, y) {
	//this.animation = new Animation(spritesheet, 64, 64, 8, 0.07, 60, true, 1.0);
	this.x = x;
	this.y = y;
	this.overWorldSpeed = 1;
	
	this.direction = {
			// down-(1) right-(0) up-(-1) left-(-3)
			// Based off of radians.
			UP: -1,
			RIGHT: 0,
			DOWN: 1,
			LEFT: -3
	};
	
	this.angle = this.direction.DOWN;
	
	this.runAnimationSpeed = 0.2;
	this.walkAnimationSpeed = 0.4;
	this.isWalking = true;
}

Enemy.prototype = new Event();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
//	this.screenX = this.x - gm.em.backgroundEntity.x;
//	this.screenY = this.y - gm.em.backgroundEntity.y;
	var deltaX = gm.player.hitBox.getScreenX() - this.hitBox.getScreenX();
	var deltaY = gm.player.hitBox.getScreenY() - this.hitBox.getScreenY();
	if (Math.abs(deltaX) < 4*TILE_SIZE && Math.abs(deltaY) < 4*TILE_SIZE) {
		this.angle = Math.atan2(deltaY, deltaX);
		this.x += this.overWorldSpeed * Math.cos(this.angle);
		this.y += this.overWorldSpeed * Math.sin(this.angle);
		if (this.isWalking) {
			this.setWalkAnimationState(false);
		}
	} else if (!this.isWalking) {
		this.setWalkAnimationState(true);
	}
	
	Event.prototype.update.call(this);
}

Enemy.prototype.draw = function () {
	// Visual Debugging of Event Locations
	//this.animation.drawEntity(this..clockTick, this..ctx, this.screenX, this.screenY);
	if (gm.hitBoxVisible) {
		gm.ctx.strokeStyle = "cyan";
	    gm.ctx.strokeRect(this.hitBox.getScreenX(), this.hitBox.getScreenY(),
	    						 this.hitBox.width, this.hitBox.height);
	}
}

Enemy.prototype.collisionTrigger = function (player) {
	console.log("Enemy Collision: " + this.constructor.name);
	// Put logic here for transition to battle scene.
	this.angle = this.direction.DOWN;
	this.removeFromWorld = true;
	gm.startBattle(this);
}

Enemy.prototype.runAnimation = function (angle) {
	switch (true) {
		case (angle < -2.3562):
			this.leftAnimation.drawEnemyType01(gm.clockTick, gm.ctx, this.x, this.y);
			break;
		case (angle < -0.7854):
			this.upAnimation.drawEnemyType01(gm.clockTick, gm.ctx, this.x, this.y);
			break;
		case (angle < 0.7854):
			this.rightAnimation.drawEnemyType01(gm.clockTick, gm.ctx, this.x, this.y);
			break;
		case (angle < 2.3562):
			this.downAnimation.drawEnemyType01(gm.clockTick, gm.ctx, this.x, this.y);
			break;
		default:
			this.leftAnimation.drawEnemyType01(gm.clockTick, gm.ctx, this.x, this.y);
			break;
	}
}

Enemy.prototype.setWalkAnimationState = function (isWalking) {
	this.isWalking = isWalking;
	if (isWalking) {
		this.leftAnimation.frameDuration = this.walkAnimationSpeed;
		this.rightAnimation.frameDuration = this.walkAnimationSpeed;
		this.downAnimation.frameDuration = this.walkAnimationSpeed;
		this.upAnimation.frameDuration = this.walkAnimationSpeed;
	} else {
		this.leftAnimation.frameDuration = this.runAnimationSpeed;
		this.rightAnimation.frameDuration = this.runAnimationSpeed;
		this.downAnimation.frameDuration = this.runAnimationSpeed;
		this.upAnimation.frameDuration = this.runAnimationSpeed;
	}
	
}


/**
 * Custom Animation function for enemies with multiple directions.
 */
Animation.prototype.drawEnemyType01 = function (tick, ctx, x, y) {
	//only draw if it's gonna be] visible
	if(gm.cam.isVisible(this)) {
		this.elapsedTime += tick;
		if (this.isDone()) {
			if (this.loop) this.elapsedTime = 0;
		}
		var frame = this.currentFrame();
		var xindex = 0;
		var yindex = 0;
		xindex = frame % this.sheetWidth;
		yindex = this.row;

		var screenPoint = gm.cam.getMyScreenXandY(x, y);
		if (this.spriteSheet)
		{
			ctx.drawImage(this.spriteSheet,
				xindex * this.frameWidth, yindex * this.frameHeight,
				this.frameWidth, this.frameHeight,
				screenPoint.x, screenPoint.y,
				this.frameWidth * this.scale,
				this.frameHeight * this.scale);
		}
	}
}




///* +------------------------------------------+ */
///* |           ===  Werewolf  ===             | */
///* +------------------------------------------+ */
//function Werewolf(x, y) {
//	
//	this.animation = new Animation(gm.am.getAsset("./img/werewolf.png"), 
//					 		TILE_SIZE, TILE_SIZE, 4, 0.20, 16, true, 1);
//	this.x = x;
//	this.y = y;
//	this.angle = 0;
//	this.hitBox = new CollisionBox(this, 10, 10, TILE_SIZE-20, TILE_SIZE-20);
//}
//Werewolf.prototype = new Enemy();
//Werewolf.prototype.constructor = Werewolf;
//
//Werewolf.prototype.draw = function () {
//	this.animation.drawEntity(gm.clockTick, gm.ctx, this.x, this.y);
//	Enemy.prototype.draw.call(this);
//}
//Werewolf.prototype.update = function () {
//	Enemy.prototype.update.call(this);
//}
//Werewolf.prototype.collisionTrigger = function (player) {
//	Enemy.prototype.collisionTrigger.call(this, player);
//}
//
//
//
//
///* +------------------------------------------+ */
///* |             ===  Green  ===              | */
///* +------------------------------------------+ */
//function Green(x, y) {
//	
//	this.animation = new Animation(gm.am.getAsset("./img/greenrage.png"),
//							TILE_SIZE, TILE_SIZE, 8, 0.07, 60, true, 1.0);
//	this.x = x;
//	this.y = y;
//	this.angle = 0;
//	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
//}
//Green.prototype = new Enemy();
//Green.prototype.constructor = Green;
//
//Green.prototype.draw = function () {
//	this.animation.drawEntity(gm.clockTick, gm.ctx, this.x, this.y);
//	Enemy.prototype.draw.call(this);
//}
//Green.prototype.update = function () {
//	Enemy.prototype.update.call(this);
//}
//Green.prototype.collisionTrigger = function (player) {
//	Enemy.prototype.collisionTrigger.call(this, player);
//}
//
//
//
//
///* +------------------------------------------+ */
///* |             ===  Shark  ===              | */
///* +------------------------------------------+ */
//function Shark(x, y) {
//	
//	this.animation = new Animation(gm.am.getAsset("./img/shark.png"),
//							TILE_SIZE, TILE_SIZE, 4, 0.1, 16, true, 1.0);
//	this.x = x;
//	this.y = y;
//	this.angle = 0;
//	this.hitBox = new CollisionBox(this, 13, 10, TILE_SIZE-20, TILE_SIZE-20);
//}
//Shark.prototype = new Enemy();
//Shark.prototype.constructor = Shark;
//
//Shark.prototype.draw = function () {
//	this.animation.drawEntity(gm.clockTick, gm.ctx, this.x, this.y);
//	Enemy.prototype.draw.call(this);
//}
//Shark.prototype.update = function () {
//	Enemy.prototype.update.call(this);
//}
//Shark.prototype.collisionTrigger = function (player) {
//	Enemy.prototype.collisionTrigger.call(this, player);
//}
//
//
//
///* +------------------------------------------+ */
///* |              ===  Fire  ===              | */
///* +------------------------------------------+ */
//function Fire(x, y, spritesheet) {
//	
//	this.animation = new Animation(gm.am.getAsset("./img/alienfirebird.png"),
//							TILE_SIZE, TILE_SIZE, 2, 0.15, 4, true, 1.0);
//	this.x = x;
//	this.y = y;
//	this.angle = 0;
//	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-20);
//}
//Fire.prototype = new Enemy();
//Fire.prototype.constructor = Fire;
//
//Fire.prototype.draw = function () {
//	this.animation.drawEntity(gm.clockTick, gm.ctx, this.x, this.y);
//	Enemy.prototype.draw.call(this);
//}
//Fire.prototype.update = function () {
//	Enemy.prototype.update.call(this);
//}
//Fire.prototype.collisionTrigger = function (player) {
//	Enemy.prototype.collisionTrigger.call(this, player);
//}

/* +------------------------------------------+ */
/* |            ===  Bandit  ===              | */
/* +------------------------------------------+ */
function Bandit(x, y) {
	this.runAnimationSpeed = 0.2;
	this.walkAnimationSpeed = 0.4;
	this.isWalking = true;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/bandit.png"),
			32, 48, 3, this.walkAnimationSpeed, 3, true, 1.33, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/bandit.png"),
			32, 48, 3, this.walkAnimationSpeed, 3, true, 1.33, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/bandit.png"),
			32, 48, 3, this.walkAnimationSpeed, 3, true, 1.33, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/bandit.png"),
			32, 48, 3, this.walkAnimationSpeed, 3, true, 1.33, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = 11;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
Bandit.prototype = new Enemy();
Bandit.prototype.constructor = Bandit;

Bandit.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
Bandit.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
Bandit.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}



/* +------------------------------------------+ */
/* |         ===  UndeadJacket  ===          | */
/* +------------------------------------------+ */
function UndeadJacket(x, y) {
	this.runAnimationSpeed = 0.2;
	this.walkAnimationSpeed = 0.4;
	this.isWalking = true;
	this.overWorldSpeed = 0.4;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/undead_jacket.png"),
			32, 48, 4, this.walkAnimationSpeed, 4, true, 1.33, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/undead_jacket.png"),
			32, 48, 4, this.walkAnimationSpeed, 4, true, 1.33, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/undead_jacket.png"),
			32, 48, 4, this.walkAnimationSpeed, 4, true, 1.33, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/undead_jacket.png"),
			32, 48, 4, this.walkAnimationSpeed, 4, true, 1.33, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = 11;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
UndeadJacket.prototype = new Enemy();
UndeadJacket.prototype.constructor = UndeadJacket;

UndeadJacket.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
UndeadJacket.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
UndeadJacket.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}


/* +------------------------------------------+ */
/* |          ===  BirdMonster  ===          | */
/* +------------------------------------------+ */
function BirdMonster(x, y) {
	
	this.runAnimationSpeed = 0.1;
	this.walkAnimationSpeed = 0.2;
	this.isWalking = true;
	this.overWorldSpeed = 1.2;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/bird_monster.png"),
			96, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/bird_monster.png"),
			96, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/bird_monster.png"),
			96, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/bird_monster.png"),
			96, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = 0;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
BirdMonster.prototype = new Enemy();
BirdMonster.prototype.constructor = BirdMonster;

BirdMonster.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
BirdMonster.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
BirdMonster.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}


/* +------------------------------------------+ */
/* |           ===  FlyingBug  ===            | */
/* +------------------------------------------+ */
function FlyingBug(x, y) {
	
	this.runAnimationSpeed = 0.2;
	this.walkAnimationSpeed = 0.3;
	this.isWalking = true;
	this.overWorldSpeed = 1.2;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/bug_flying.png"),
			80, 64, 3, this.walkAnimationSpeed, 3, true, 1, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/bug_flying.png"),
			80, 64, 3, this.walkAnimationSpeed, 3, true, 1, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/bug_flying.png"),
			80, 64, 3, this.walkAnimationSpeed, 3, true, 1, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/bug_flying.png"),
			80, 64, 3, this.walkAnimationSpeed, 3, true, 1, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = -8;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
FlyingBug.prototype = new Enemy();
FlyingBug.prototype.constructor = FlyingBug;

FlyingBug.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
FlyingBug.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
FlyingBug.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}


/* +------------------------------------------+ */
/* |             ===  Devil  ===              | */
/* +------------------------------------------+ */
function Devil(x, y) {
	
	this.runAnimationSpeed = 0.2;
	this.walkAnimationSpeed = 0.3;
	this.isWalking = true;
	this.overWorldSpeed = 1.2;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/devil.png"),
			48, 64, 3, this.walkAnimationSpeed, 3, true, 1, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/devil.png"),
			48, 64, 3, this.walkAnimationSpeed, 3, true, 1, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/devil.png"),
			48, 64, 3, this.walkAnimationSpeed, 3, true, 1, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/devil.png"),
			48, 64, 3, this.walkAnimationSpeed, 3, true, 1, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = 8;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
Devil.prototype = new Enemy();
Devil.prototype.constructor = Devil;

Devil.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
Devil.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
Devil.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}


/* +------------------------------------------+ */
/* |        ===  ThreeHeadedDog  ===          | */
/* +------------------------------------------+ */
function ThreeHeadedDog(x, y) {
	
	this.runAnimationSpeed = 0.2;
	this.walkAnimationSpeed = 0.3;
	this.isWalking = true;
	this.overWorldSpeed = 1.2;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/dog_3headed.png"),
			64, 64, 3, this.walkAnimationSpeed, 3, true, 1, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/dog_3headed.png"),
			64, 64, 3, this.walkAnimationSpeed, 3, true, 1, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/dog_3headed.png"),
			64, 64, 3, this.walkAnimationSpeed, 3, true, 1, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/dog_3headed.png"),
			64, 64, 3, this.walkAnimationSpeed, 3, true, 1, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = 0;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
ThreeHeadedDog.prototype = new Enemy();
ThreeHeadedDog.prototype.constructor = ThreeHeadedDog;

ThreeHeadedDog.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
ThreeHeadedDog.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
ThreeHeadedDog.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}


/* +------------------------------------------+ */
/* |            ===  Kraken  ===              | */
/* +------------------------------------------+ */
function Kraken(x, y) {
	
	this.runAnimationSpeed = 0.2;
	this.walkAnimationSpeed = 0.3;
	this.isWalking = true;
	this.overWorldSpeed = 0.4;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/kraken.png"),
			64, 80, 3, this.walkAnimationSpeed, 3, true, 1, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/kraken.png"),
			64, 80, 3, this.walkAnimationSpeed, 3, true, 1, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/kraken.png"),
			64, 80, 3, this.walkAnimationSpeed, 3, true, 1, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/kraken.png"),
			64, 80, 3, this.walkAnimationSpeed, 3, true, 1, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = 0;
	this.tileYOffSet = -16;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
Kraken.prototype = new Enemy();
Kraken.prototype.constructor = Kraken;

Kraken.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset + this.tileYOffSet;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
Kraken.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
Kraken.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}


/* +------------------------------------------+ */
/* |          ===  LizardMan  ===             | */
/* +------------------------------------------+ */
function LizardMan(x, y) {
	
	this.runAnimationSpeed = 0.15;
	this.walkAnimationSpeed = 0.3;
	this.isWalking = true;
	this.overWorldSpeed = 1.0;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/lizard_man.png"),
			48, 64, 3, this.walkAnimationSpeed, 3, true, 1, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/lizard_man.png"),
			48, 64, 3, this.walkAnimationSpeed, 3, true, 1, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/lizard_man.png"),
			48, 64, 3, this.walkAnimationSpeed, 3, true, 1, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/lizard_man.png"),
			48, 64, 3, this.walkAnimationSpeed, 3, true, 1, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = 8;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
LizardMan.prototype = new Enemy();
LizardMan.prototype.constructor = LizardMan;

LizardMan.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
LizardMan.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
LizardMan.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}


/* +------------------------------------------+ */
/* |          ===  Goblin  ===             | */
/* +------------------------------------------+ */
function Goblin(x, y) {
	
	this.runAnimationSpeed = 0.15;
	this.walkAnimationSpeed = 0.3;
	this.isWalking = true;
	this.overWorldSpeed = 1.0;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/goblin.png"),
			48, 64, 3, this.walkAnimationSpeed, 3, true, 1, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/goblin.png"),
			48, 64, 3, this.walkAnimationSpeed, 3, true, 1, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/goblin.png"),
			48, 64, 3, this.walkAnimationSpeed, 3, true, 1, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/goblin.png"),
			48, 64, 3, this.walkAnimationSpeed, 3, true, 1, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = 8;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
Goblin.prototype = new Enemy();
Goblin.prototype.constructor = Goblin;

Goblin.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
Goblin.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
Goblin.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}


/* +------------------------------------------+ */
/* |          ===  Mercenary  ===             | */
/* +------------------------------------------+ */
function Mercenary(x, y) {
	
	this.runAnimationSpeed = 0.15;
	this.walkAnimationSpeed = 0.3;
	this.isWalking = true;
	this.overWorldSpeed = 1.0;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/mercenary.png"),
			48, 48, 4, this.walkAnimationSpeed, 4, true, 4/3, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/mercenary.png"),
			48, 48, 4, this.walkAnimationSpeed, 4, true, 4/3, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/mercenary.png"),
			48, 48, 4, this.walkAnimationSpeed, 4, true, 4/3, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/mercenary.png"),
			48, 48, 4, this.walkAnimationSpeed, 4, true, 4/3, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = 0;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
Mercenary.prototype = new Enemy();
Mercenary.prototype.constructor = Mercenary;

Mercenary.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
Mercenary.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
Mercenary.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}


/* +------------------------------------------+ */
/* |             ===  Naga  ===               | */
/* +------------------------------------------+ */
function Naga(x, y) {
	
	this.runAnimationSpeed = 0.15;
	this.walkAnimationSpeed = 0.3;
	this.isWalking = true;
	this.overWorldSpeed = 1.0;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/naga.png"),
			48, 48, 4, this.walkAnimationSpeed, 4, true, 4/3, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/naga.png"),
			48, 48, 4, this.walkAnimationSpeed, 4, true, 4/3, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/naga.png"),
			48, 48, 4, this.walkAnimationSpeed, 4, true, 4/3, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/naga.png"),
			48, 48, 4, this.walkAnimationSpeed, 4, true, 4/3, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = 0;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
Naga.prototype = new Enemy();
Naga.prototype.constructor = Naga;

Naga.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
Naga.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
Naga.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}


/* +------------------------------------------+ */
/* |             ===  Ogre  ===               | */
/* +------------------------------------------+ */
function Ogre(x, y) {
	
	this.runAnimationSpeed = 0.2;
	this.walkAnimationSpeed = 0.4;
	this.isWalking = true;
	this.overWorldSpeed = 0.8;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/ogre.png"),
			80, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/ogre.png"),
			80, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/ogre.png"),
			80, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/ogre.png"),
			80, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = 5;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
Ogre.prototype = new Enemy();
Ogre.prototype.constructor = Ogre;

Ogre.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
Ogre.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
Ogre.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}


/* +------------------------------------------+ */
/* |             ===  Slime  ===               | */
/* +------------------------------------------+ */
function Slime(x, y) {
	
	this.runAnimationSpeed = 0.2;
	this.walkAnimationSpeed = 0.4;
	this.isWalking = true;
	this.overWorldSpeed = 0.8;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/slime_monster.png"),
			48, 48, 3, this.walkAnimationSpeed, 3, true, 4/3, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/slime_monster.png"),
			48, 48, 3, this.walkAnimationSpeed, 3, true, 4/3, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/slime_monster.png"),
			48, 48, 3, this.walkAnimationSpeed, 3, true, 4/3, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/slime_monster.png"),
			48, 48, 3, this.walkAnimationSpeed, 3, true, 4/3, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = 0;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
Slime.prototype = new Enemy();
Slime.prototype.constructor = Slime;

Slime.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
Slime.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
Slime.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}


/* +------------------------------------------+ */
/* |             ===  Snake03  ===               | */
/* +------------------------------------------+ */
function Snake03(x, y) {
	
	this.runAnimationSpeed = 0.2;
	this.walkAnimationSpeed = 0.4;
	this.isWalking = true;
	this.overWorldSpeed = 0.8;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/snake03.png"),
			64, 64, 3, this.walkAnimationSpeed, 3, true, 1, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/snake03.png"),
			64, 64, 3, this.walkAnimationSpeed, 3, true, 1, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/snake03.png"),
			64, 64, 3, this.walkAnimationSpeed, 3, true, 1, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/snake03.png"),
			64, 64, 3, this.walkAnimationSpeed, 3, true, 1, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = 0;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
Snake03.prototype = new Enemy();
Snake03.prototype.constructor = Snake03;

Snake03.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
Snake03.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
Snake03.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}


/* +------------------------------------------+ */
/* |             ===  Snake04  ===               | */
/* +------------------------------------------+ */
function Snake04(x, y) {
	
	this.runAnimationSpeed = 0.1;
	this.walkAnimationSpeed = 0.3;
	this.isWalking = true;
	this.overWorldSpeed = 0.8;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/snake04.png"),
			96, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/snake04.png"),
			96, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/snake04.png"),
			96, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/snake04.png"),
			96, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = 0;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
Snake04.prototype = new Enemy();
Snake04.prototype.constructor = Snake04;

Snake04.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
Snake04.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
Snake04.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}


/* +------------------------------------------+ */
/* |         ===  StoneMonster  ===           | */
/* +------------------------------------------+ */
function StoneMonster(x, y) {
	
	this.runAnimationSpeed = 0.4;
	this.walkAnimationSpeed = 0.6;
	this.isWalking = true;
	this.overWorldSpeed = 0.4;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/stone_monster.png"),
			96, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/stone_monster.png"),
			96, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/stone_monster.png"),
			96, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/stone_monster.png"),
			96, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = 0;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
StoneMonster.prototype = new Enemy();
StoneMonster.prototype.constructor = StoneMonster;

StoneMonster.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
StoneMonster.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
StoneMonster.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}



/* +------------------------------------------+ */
/* |          ===  TreeMonster  ===           | */
/* +------------------------------------------+ */
function TreeMonster(x, y) {
	
	this.runAnimationSpeed = 0.4;
	this.walkAnimationSpeed = 0.6;
	this.isWalking = true;
	this.overWorldSpeed = 0.4;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/tree_monster.png"),
			96, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/tree_monster.png"),
			96, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/tree_monster.png"),
			96, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/tree_monster.png"),
			96, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = 0;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
TreeMonster.prototype = new Enemy();
TreeMonster.prototype.constructor = TreeMonster;

TreeMonster.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
TreeMonster.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
TreeMonster.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}


/* +------------------------------------------+ */
/* |          ===  UndeadCreeper  ===           | */
/* +------------------------------------------+ */
function UndeadCreeper(x, y) {
	
	this.runAnimationSpeed = 0.1;
	this.walkAnimationSpeed = 1.8;
	this.isWalking = true;
	this.overWorldSpeed = 1.6;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/undead_creeper.png"),
			32, 48, 4, this.walkAnimationSpeed, 4, true, 1, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/undead_creeper.png"),
			32, 48, 4, this.walkAnimationSpeed, 4, true, 1, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/undead_creeper.png"),
			32, 48, 4, this.walkAnimationSpeed, 4, true, 1, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/undead_creeper.png"),
			32, 48, 4, this.walkAnimationSpeed, 4, true, 1, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = 16;
	this.tileYOffSet = 8;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
UndeadCreeper.prototype = new Enemy();
UndeadCreeper.prototype.constructor = UndeadCreeper;

UndeadCreeper.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset + this.tileYOffSet;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
UndeadCreeper.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
UndeadCreeper.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}


/* +------------------------------------------+ */
/* |            ===  Zombie  ===              | */
/* +------------------------------------------+ */
function Zombie(x, y) {
	
	this.runAnimationSpeed = 0.4;
	this.walkAnimationSpeed = 1;
	this.isWalking = true;
	this.overWorldSpeed = 0.6;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/undead02.png"),
			40, 56, 3, this.walkAnimationSpeed, 3, true, 1.14, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/undead02.png"),
			40, 56, 3, this.walkAnimationSpeed, 3, true, 1.14, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/undead02.png"),
			40, 56, 3, this.walkAnimationSpeed, 3, true, 1.14, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/undead02.png"),
			40, 56, 3, this.walkAnimationSpeed, 3, true, 1.14, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = 9;
	this.tileYOffSet = 0;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
Zombie.prototype = new Enemy();
Zombie.prototype.constructor = Zombie;

Zombie.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset + this.tileYOffSet;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
Zombie.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
Zombie.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}



/* +------------------------------------------+ */
/* |            ===  Skeleton  ===            | */
/* +------------------------------------------+ */
function Skeleton(x, y) {
	
	this.runAnimationSpeed = 0.3;
	this.walkAnimationSpeed = 1;
	this.isWalking = true;
	this.overWorldSpeed = 0.8;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/undead03.png"),
			40, 56, 3, this.walkAnimationSpeed, 3, true, 1.14, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/undead03.png"),
			40, 56, 3, this.walkAnimationSpeed, 3, true, 1.14, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/undead03.png"),
			40, 56, 3, this.walkAnimationSpeed, 3, true, 1.14, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/undead03.png"),
			40, 56, 3, this.walkAnimationSpeed, 3, true, 1.14, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = 9;
	this.tileYOffSet = 0;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
Skeleton.prototype = new Enemy();
Skeleton.prototype.constructor = Skeleton;

Skeleton.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset + this.tileYOffSet;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
Skeleton.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
Skeleton.prototype.collisionTrigger = function (player) {
	Enemy.prototype.collisionTrigger.call(this, player);
}


/* +------------------------------------------+ */
/* |              ===  Lich  ===              | */
/* +------------------------------------------+ */
function Lich(x, y) {
	
	this.runAnimationSpeed = 0.2;
	this.walkAnimationSpeed = 0.4;
	this.isWalking = true;
	this.overWorldSpeed = 2.0;
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.downAnimation = new Animation(gm.am.getAsset("./img/enemies/undead04.png"),
			80, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 0);
	this.leftAnimation = new Animation(gm.am.getAsset("./img/enemies/undead04.png"),
			80, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 1);
	this.rightAnimation = new Animation(gm.am.getAsset("./img/enemies/undead04.png"),
			80, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 2);
	this.upAnimation = new Animation(gm.am.getAsset("./img/enemies/undead04.png"),
			80, 96, 3, this.walkAnimationSpeed, 3, true, 2/3, 3);
	this.x = x;
	this.y = y;
	this.tileXOffSet = 5;
	this.tileYOffSet = 0;
	this.hitBox = new CollisionBox(this, 5, 10, TILE_SIZE-20, TILE_SIZE-10);
	this.angle = this.direction.DOWN;
}
Lich.prototype = new Enemy();
Lich.prototype.constructor = Lich;

Lich.prototype.draw = function (ctx, battleLocation) {
	if (battleLocation != undefined) {
		this.x = battleLocation.x + battleLocation.xOffset + this.tileXOffSet;
		this.y = battleLocation.y + battleLocation.yOffset + this.tileYOffSet;
	}
	this.runAnimation(this.angle);
	Enemy.prototype.draw.call(this);
}
Lich.prototype.update = function () {
	Enemy.prototype.update.call(this);
}
Lich.prototype.collisionTrigger = function (player) {
//	gm.openDialogueBox("Scary Lich Boss",
//		"I am the boss! rawwrrrrr.");
	Enemy.prototype.collisionTrigger.call(this, player);
}

