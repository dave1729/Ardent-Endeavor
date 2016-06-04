function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale, row) {
	this.spriteSheet = spriteSheet;
	this.frameWidth = frameWidth;
	this.frameDuration = frameDuration;
	this.frameHeight = frameHeight;
	this.sheetWidth = sheetWidth;
	this.frames = frames;
	this.yindex = 0;
	this.totalTime = frameDuration * frames;
	this.elapsedTime = 0;
	this.loop = loop;
	this.scale = scale;
	this.row = row;
}

Animation.prototype.currentFrame = function () {
	return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
	return (this.elapsedTime >= this.totalTime);
}

Animation.prototype.drawEntity = function (tick, ctx, x, y) {
	//only draw if it's gonna be vivible
	if(gm.cam.isVisible(this)) {
		this.elapsedTime += tick;
		if (this.isDone()) {
			if (this.loop) this.elapsedTime = 0;
		}
		var frame = this.currentFrame();
		var xindex = 0;
		var yindex = this.yindex;
		xindex = frame % this.sheetWidth;
		yindex = Math.floor(frame / this.sheetWidth);

		var screenPoint = gm.cam.getMyScreenXandY(x, y);
		
		ctx.drawImage(this.spriteSheet,
				xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
				this.frameWidth, this.frameHeight,
				screenPoint.x, screenPoint.y,
				this.frameWidth * this.scale,
				this.frameHeight * this.scale);		
	}
}

Animation.prototype.updateEntity = function (entity) {
	if(entity.game.controlEntity.x !== null) {
		entity.screenX = entity.x - gm.cam.leftX;
		entity.screenY = entity.y - gm.cam.topY;
	}
}

Animation.prototype.drawPlayer = function (tick, ctx, x, y, entity) {

	this.elapsedTime += tick;
	if (this.isDone()) {
		if (this.loop) this.elapsedTime = 0;
	}
	var frame = this.currentFrame();
	var xindex = 0;
	var yindex = 0;
	xindex = frame % this.sheetWidth;

	//Choosing character sprite from sheet
	if(gm.im.checkInput("up") && gm.im.checkInput("left")) {
		yindex = 8;
	}
	else if(gm.im.checkInput("up") && gm.im.checkInput("right")) {
		yindex = 8;
	}
	else if(gm.im.checkInput("down") && gm.im.checkInput("left")) {
		yindex = 10;
	}
	else if(gm.im.checkInput("down") && gm.im.checkInput("right")) {
		yindex = 10;
	}
	else if(gm.im.checkInput("up")) {
		yindex = 8;
	}
	else if(gm.im.checkInput("down")) {
		yindex = 10;
	}
	else if(gm.im.checkInput("left")) {
		yindex = 9;
	}
	else if(gm.im.checkInput("right")) {
		yindex = 11;
	}
	else {
		xindex = 0;
		yindex = 6;
	}

	var screenPoint = gm.cam.getMyScreenXandY(entity.x, entity.y);
	
	ctx.drawImage(this.spriteSheet,
			xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
			this.frameWidth, this.frameHeight,
			screenPoint.x, screenPoint.y,
			this.frameWidth * this.scale,
			this.frameHeight * this.scale);

	// Collision Box
	if (gm.hitBoxVisible) {
		ctx.strokeStyle = "yellow";
	    ctx.strokeRect(0 + entity.hitBox.getScreenX() , 0 + entity.hitBox.getScreenY(),
	    				entity.hitBox.width, entity.hitBox.height);
	}
}



Animation.prototype.drawPlayerUnitUIEntity = function (tick, ctx, x, y) {
	//only draw if it's gonna be vivible
	if(gm.cam.isVisible(this)) {
		this.elapsedTime += tick;
		if (this.isDone()) {
			if (this.loop) this.elapsedTime = 0;
		}
		var frame = this.currentFrame();
		var xindex = 0;
		var yindex = this.yindex;
		xindex = frame % this.sheetWidth;
		yindex = Math.floor(frame / this.sheetWidth);

		var screenPoint = gm.cam.getMyScreenXandY(x, y);
		
		ctx.drawImage(this.spriteSheet,
				xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
				this.frameWidth, this.frameHeight,
				x, y,
				this.frameWidth * this.scale,
				this.frameHeight * this.scale);		
	}
}