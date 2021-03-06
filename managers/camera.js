function Camera(screenWidth, screenHeight) {
	this.leftX = 0;
	this.topY = 0;
	this.rightX = Math.floor(screenWidth);
	this.bottomY = Math.floor(screenHeight);
	this.width = Math.floor(screenWidth);
	this.height = Math.floor(screenHeight);
	this.currentEntity = null;
	this.isFollowing = false;
}

//Returns a Point object that has the new x and y
//which can be used to draw your object in the right place
Camera.prototype.getMyScreenXandY = function(mapX, mapY) {
	return { x: Math.floor(mapX - this.leftX), y: Math.floor(mapY - this.topY)};
}

//requires hitBox
Camera.prototype.isVisible = function(entity) {
	var visible = true;
	
	//you're too far left to be seen
	if((entity.x + entity.frameWidth) < this.leftX) {
		visible = false;
	}
	//you're too far right to be seen
	if(entity.x > this.rightX) {
		visible = false;
	}
	
	//you're too far up to be seen
	if(entity.y + entity.frameHeight < this.topY) {
		visible = false;
	}
	//you're too far down to be seen
	if(entity.y > this.bottomY) {
		visible = false;
	}
		
	return visible;

//	CollisionBox Field Reminder
//	this.entity;
//	this.offsetX;
//	this.offsetY;
//	this.width;
//	this.height;
}

Camera.prototype.update = function() {
	if(this.isFollowing) {
		//Reminder in case Camera stops working on NPC Character.
		if(this.currentEntity.spriteSquareSize === null) alert("Camera Follow Entity doesn't have field spriteSquareSize!");
		
		//dungeon/8 = half a visible screen, 0.5 = character scale ratio
		var newX = Math.floor(this.currentEntity.x - Math.floor(gm.canvas.width/2  - (this.currentEntity.spriteSquareSize / 2)));
		var newY = Math.floor(this.currentEntity.y - Math.floor(gm.canvas.height/2 - (this.currentEntity.spriteSquareSize / 2)));
		//alert(dungeonHeight + " " + this.currentEntity.spriteSquareSize / 2)));
		
		//dungeonWidth/4 one visible screen width
		if(newX >= 0 && newX <= (dungeonWidth - gm.canvas.width)) {
			this.leftX = Math.floor(newX);
			this.rightX = Math.floor(newX + this.width);
		}
		else if (newX < 0){
			this.leftX = 0
			this.rightX = Math.floor(this.width);
		}
		else if (newX > (dungeonWidth - gm.canvas.width)) {
			this.leftX = Math.floor(dungeonWidth - this.width);
			this.rightX = Math.floor(dungeonWidth);
		}
		
		if(newY >= 0 && newY <= (dungeonHeight - gm.canvas.height) ) {
			this.topY = Math.floor(newY);
			this.bottomY = Math.floor(newY + this.height);
		}
		else if (newY < 0){
			this.topY = 0
			this.bottomY = Math.floor(this.height);
		}
		else if (newY > (dungeonHeight - gm.canvas.height)) {
			this.topY = Math.floor(dungeonHeight - this.height);
			this.bottomY = Math.floor(dungeonHeight);
		}
	}

	Entity.prototype.update.call(this);
}

Camera.prototype.follow = function(entity) {
	this.currentEntity = entity;
	this.isFollowing = true;
}

Camera.prototype.stopFollow = function() {
	this.currentEntity = null;
	this.isFollowing = false;
}

//Jumps to Camera position where the top left CORNER is passed
Camera.prototype.jumpToByCorner = function(x, y) {
	//dungeonWidth, dungeonHeight
	var newLeftX = Math.floor(x);
	var newRightX = Math.floor(x + this.width);
	var newTopY = Math.floor(y);
	var newBottomY = Math.floor(y + this.height);
	
	if(newLeftX < 0) {
		newLeftX = 0;
		newRightX = Math.floor(this.width);
	}
	else if (newRightX > dungeonWidth) {
		newLeftX = Math.floor(dungeonWidth - this.width);
		newRightX = Math.floor(dungeonWidth);
	}

	if(newTopY < 0) {
		newTopY = 0;
		newBottomY = Math.floor(this.height);
	}
	else if (newBottomY > dungeonHeight) {
		newTopY = Math.floor(dungeonHeight - this.height);
		newBottomY = Math.floor(dungeonHeight);
	}

	//If we are jumping somewhere, we shouldn't follow anyone as well.
	this.stopFollow();
	
	this.leftX = newLeftX;
	this.rightX = newRightX;
	this.topY = newTopY;
	this.bottomY = newBottomY;
}

//Jumps to Camera position where the MIDDLE of the screen is passed
Camera.prototype.jumpToByMid = function(x, y) {
	var newLeftX = Math.floor(x - this.width/2);
	var newTopY = Math.floor(y - this.height/2);
	this.jumpToByCorner(newLeftX, newTopY)
}