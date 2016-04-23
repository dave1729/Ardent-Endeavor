var AM = new AssetManager();

const testingMode = false;
const sqrtOneHalf = 0.70711;
const dungeonWidth = 2048;
const dungeonHeight = 1920;
const screenToMapRatio = 0.75;

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, entity) {
	
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    
    if(entity.w && entity.a) {
    	yindex = 8;
    }
    else if(entity.w && entity.d) {
    	yindex = 8;
    }
    else if(entity.s && entity.a) {
    	yindex = 10;
    }
    else if(entity.s && entity.d) {
    	yindex = 10;
    }
    else if(entity.w) {
    	yindex = 8;
    }
    else if(entity.s) {
    	yindex = 10;
    }
    else if(entity.a) {
    	yindex = 9;
    }
    else if(entity.d) {
    	yindex = 11;
    }
    else {
    	yindex = 10;
    }
    
    var tempX = x;
    var tempY = y;
    var centerX = Math.floor(dungeonWidth/8  - (64 / 2));
    var centerY = Math.floor(dungeonHeight/8 - (64 / 2));
    
    //centering circle for testing
    if(testingMode) {
    	ctx.arc(dungeonWidth/8,dungeonHeight/8,20,0,2*Math.PI);
    	ctx.stroke();
    }
    
    if (x > centerX && x < (screenToMapRatio * dungeonWidth) + centerX) {
    	tempX = centerX;
    }
    else if (x >= (screenToMapRatio * dungeonWidth) + centerX) {
    	tempX = x - (screenToMapRatio * dungeonWidth);
    }
    
    if(y > centerY && y < (screenToMapRatio * dungeonHeight) + centerY) {
    	tempY = centerY;
    }
    else if (y >= (screenToMapRatio * dungeonHeight) + centerY) {
    	tempY = y - (screenToMapRatio * dungeonHeight);
    }
    
    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 tempX, tempY,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.layer = 1;
    this.control = false;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
	//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	var width = Math.floor(dungeonWidth/4);
	var heigth = Math.floor(dungeonHeight/4);
    this.ctx.drawImage(this.spritesheet,this.x, this.y, width, heigth,
    		0, 0, width, heigth);
};

Background.prototype.update = function () {
	if(this.game.controlEntity.x !== null) {
		//dungeon/8 = half a visible screen, 0.5 = character scale ratio
		var newX = this.game.controlEntity.x - Math.floor(dungeonWidth/8  - (64 / 2));
	    var newY = this.game.controlEntity.y - Math.floor(dungeonHeight/8 - (64 / 2));
		
	    //dungeonWidth/4 one visible screen width
		if(newX >= 0 && newX <= (dungeonWidth - dungeonWidth/4)) {
			this.x = newX;
		}
		if(newY >= 0 && newY <= (dungeonHeight - dungeonHeight/4) ) {
			this.y = newY;
		}
	}
	else {
		alert("Alert: Board Not updated, when Arrow was moved.");
	}
	Entity.prototype.update.call(this);
};

//no inheritance
function Collidable_background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.layer = 2;
    this.control = false;
    this.ctx = game.ctx;
};

Collidable_background.prototype.draw = function () {
	//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	var width = Math.floor(dungeonWidth/4);
	var heigth = Math.floor(dungeonHeight/4);
    this.ctx.drawImage(this.spritesheet,this.x, this.y, width, heigth,
    		0, 0, width, heigth);
};

Collidable_background.prototype.update = function () {
	if(this.game.controlEntity.x !== null) {
		//dungeon/8 = half a visible screen, 0.5 = character scale ratio
		var newX = this.game.controlEntity.x - Math.floor(dungeonWidth/8  - (64 / 2));
	    var newY = this.game.controlEntity.y - Math.floor(dungeonHeight/8 - (64 / 2));
		
	    //dungeonWidth/4 one visible screen width
		if(newX >= 0 && newX <= (dungeonWidth - dungeonWidth/4)) {
			this.x = newX;
		}
		if(newY >= 0 && newY <= (dungeonHeight - dungeonHeight/4) ) {
			this.y = newY;
		}
	}
	else {
		alert("Alert: Board Not updated, when Arrow was moved.");
	}
	Entity.prototype.update.call(this);
};

function Player(game, spritesheet) {
	this.spriteSquareSize = 64;
	this.scale = 1;
	//Animation: spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale
    this.animation = new Animation(spritesheet, this.spriteSquareSize, this.spriteSquareSize, 9, 0.1, 32, true, this.scale);
    this.x = 235;
    this.y = 215;
    this.w = false;
    this.s = false;
    this.a = false;
    this.d = false;
    this.regSpeed = 125;
    this.speedX = 0;
    this.speedY = 0;
    this.game = game;
    this.layer = 3;
    this.control = true;
    this.ctx = game.ctx;
}

Player.prototype.entityCollisionCheck = function () {
	var rectMain = {x: this.x, y: this.y, width: 42, height: 42}
	var i;
	for (i = 0; i < this.game.entities.length; ++i) {
		var rectOther = {x: this.game.entities[i].x, y: this.game.entities[i].y, width: 50, height: 50}
		
		if (this.game.entities[i] instanceof Event) {
			if (rectMain.x < rectOther.x + rectOther.width 
					&& rectMain.x + rectMain.width > rectOther.x 
					&& rectMain.y < rectOther.y + rectOther.height 
					&& rectMain.height + rectMain.y > rectOther.y) { 
				//console.log("COLLISION DETECTED OMG");
				this.game.entities[i].collisionTrigger(this);
			} 
		}
		//console.log("ran check");
	}
}

Player.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this);

	// Collision Box
    this.ctx.strokeStyle = "yellow";
    this.ctx.strokeRect(this.x, this.y, 42, 42);
}

Player.prototype.update = function () {
    if (this.animation.elapsedTime < this.animation.totalTime) {
        var currentAdjust = this.game.clockTick * this.speed;
    	
	    if(this.w && this.a) {
	    	this.speedY = -1 * this.regSpeed * sqrtOneHalf;
	    	this.speedX = -1 * this.regSpeed * sqrtOneHalf;
	    }
	    else if(this.w && this.d) {
	    	this.speedY = -1 * this.regSpeed * sqrtOneHalf;
	    	this.speedX = this.regSpeed * sqrtOneHalf;
	    }
	    else if(this.s && this.a) {
	    	this.speedY = this.regSpeed * sqrtOneHalf;
	    	this.speedX = -1 * this.regSpeed * sqrtOneHalf;
	    }
	    else if(this.s && this.d) {
	    	this.speedY = this.regSpeed * sqrtOneHalf;
	    	this.speedX = this.regSpeed * sqrtOneHalf;
	    }
	    else if(this.w) {
	    	this.speedY = -1 * this.regSpeed;
	    }
	    else if(this.s) {
	    	this.speedY = this.regSpeed;
	    }
	    else if(this.a) {
	    	this.speedX = -1 * this.regSpeed;
	    }
	    else if(this.d) {
	    	this.speedX = this.regSpeed;
	    }
	    
	    var newX = this.x + this.game.clockTick * this.speedX;
	    var newY = this.y + this.game.clockTick * this.speedY;
	    
	    //attempting to read new layer as collidable layer
//	    var collidable = null;
//	    for (var i = 0; i < this.game.entities.length; i++) {
//	    	if(this.game.entities[i].layer === 2) {
//	    		collidable = this.entities[i];
//	    	}
//	    }
//	    
//	    var index = (newY*dungeonWidth + newX) * 4;
//	    var alpha = 0;
//	    
//	    var imgData = collidable.spritesheet.getImageData(0, 0, dungeonWidth, dungeonHeight);
//
//	    alpha = imgData.data[index+3];
//	    
//	    if(alpha > 0) {
//	    	alert(alpha);
//	    }
	    
	    //dungeon/8 = half a visible screen, 0.5 = character scale ratio
	    if(newX > 0 && newX < dungeonWidth - 64) {
	    	this.x += this.game.clockTick * this.speedX;
	    }
	    if(newY > 0 && newY < dungeonHeight - 64) {
	    	this.y += this.game.clockTick * this.speedY;
	    }
	    
	    // COLLISION
	    this.entityCollisionCheck();
    }
    Entity.prototype.update.call(this);
}

AM.queueDownload("./img/player.png");
AM.queueDownload("./img/GrassOnlyBackground.png");
AM.queueDownload("./img/collidable_background.png");
AM.queueDownload("./img/greenrage.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Player(gameEngine, AM.getAsset("./img/player.png")));
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/GrassOnlyBackground.png")));
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/collidable_background.png")));
    
    gameEngine.addEntity(new MapTeleportEvent(gameEngine, 1, 400, 400, 50, 50, 1, 800, 800));
    gameEngine.addEntity(new MapTeleportEvent(gameEngine, 1, 400, 100, 50, 50, 1, 100, 100));
    gameEngine.addEntity(new Enemy(gameEngine, 1, 100, 100, 60, 56, AM.getAsset("./img/greenrage.png")));
    console.log("All Done!");
});