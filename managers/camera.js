function Camera(screenWidth, screenHeight) {
	this.leftX = 0;
	this.topY = 0;
	this.rightX = screenWidth;
	this.bottomY = screenHeight;
	this.width = screenWidth;
	this.height = screenHeight;
	this.currentEntity = null;
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
	if(this.currentEntity !== null) {
		//Reminder in case Camera stops working on NPC Character.
		if(this.currentEntity.spriteSquareSize === null) alert("Camera Follow Entity doesn't have field spriteSquareSize!");
		
		//dungeon/8 = half a visible screen, 0.5 = character scale ratio
		var newX = this.currentEntity.x - Math.floor(dungeonWidth/8  - (this.currentEntity.spriteSquareSize / 2));
		var newY = this.currentEntity.y - Math.floor(dungeonHeight/8 - (this.currentEntity.spriteSquareSize / 2));
		//alert(dungeonHeight + " " + this.currentEntity.spriteSquareSize / 2)));
		//dungeonWidth/4 one visible screen width
		if(newX >= 0 && newX <= (dungeonWidth - dungeonWidth/4)) {
			this.leftX = newX;
			this.rightX = newX + this.width;
		}
		
		if(newY >= 0 && newY <= (dungeonHeight - dungeonHeight/4) ) {
			this.topY = newY;
			this.bottomY = newY + this.height;
		}
	}

	Entity.prototype.update.call(this);
}

Camera.prototype.follow = function(entity) {
	this.currentEntity = entity;
}

Camera.prototype.stopFollowing = function() {
	this.currentEntity = null;
}

//Jumps to Camera position where the top left CORNER is passed
Camera.prototype.jumpToByCorner = function(x, y) {
	this.leftX = x;
	this.rightX = newX + this.width;
	this.topY = y;
	this.bottomY = newY + this.height;
}

//Jumps to Camera position where the MIDDLE of the screen is passed
Camera.prototype.jumpToByMid = function(x, y) {
	this.leftX = Math.floor(x - this.width/2);
	this.rightX = Math.floor(x + this.width/2);
	this.topY = Math.floor(y - this.height/2);
	this.bottomY = Math.floor(y + this.height/2);
}