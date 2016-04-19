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
    	yindex = 4;
    }
    else if(entity.w && entity.d) {
    	yindex = 6;
    }
    else if(entity.s && entity.a) {
    	yindex = 5;
    }
    else if(entity.s && entity.d) {
    	yindex = 7;
    }
    else if(entity.w) {
    	yindex = 3;
    }
    else if(entity.s) {
    	yindex = 2;
    }
    else if(entity.a) {
    	yindex = 1;
    }
    else if(entity.d) {
    	yindex = 0;
    }
    else {
    	yindex = 2;
    }
    
    var tempX = x;
    var tempY = y;
    var centerX = Math.floor(dungeonWidth/8  - (85 * 0.5 / 2));
    var centerY = Math.floor(dungeonHeight/8 - (85 * 0.5 / 2));
    
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
		var newX = this.game.controlEntity.x - Math.floor(dungeonWidth/8  - (85 * 0.5 / 2));
	    var newY = this.game.controlEntity.y - Math.floor(dungeonHeight/8 - (85 * 0.5 / 2));
		
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

function Arrow(game, spritesheet) {
	this.spriteSquareSize = 85;
	this.scale = 0.5;
	//Animation: spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale
    this.animation = new Animation(spritesheet, this.spriteSquareSize, this.spriteSquareSize, 4, 0.2, 32, true, this.scale);
    this.x = 235;
    this.y = 215;
    this.w = false;
    this.s = false;
    this.a = false;
    this.d = false;
    this.regSpeed = 450;
    this.speedX = 0;
    this.speedY = 0;
    this.game = game;
    this.layer = 2;
    this.control = true;
    this.ctx = game.ctx;
}

Arrow.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this);
}

Arrow.prototype.update = function () {
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
	    
	    //dungeon/8 = half a visible screen, 0.5 = character scale ratio
	    if(newX > 0 && newX < dungeonWidth - (85 * 0.5)) {
	    	this.x += this.game.clockTick * this.speedX;
	    }
	    if(newY > 0 && newY < dungeonHeight - (85 * 0.5)) {
	    	this.y += this.game.clockTick * this.speedY;
	    }
    }
    Entity.prototype.update.call(this);
}

AM.queueDownload("./img/ArrowSpriteSheet.png");
AM.queueDownload("./img/GrassOnlyBackground.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Arrow(gameEngine, AM.getAsset("./img/ArrowSpriteSheet.png")));
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/GrassOnlyBackground.png")));
    
    console.log("All Done!");
});