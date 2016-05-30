//no inheritance
function Background(spritesheet) {
	this.entityID = 0;
	this.spritesheet = spritesheet;
	this.game = gm;
	this.layer = 1;
	this.control = false;
	Entity.call(this, 0, 0);
};

Background.prototype = Object.create(Entity.prototype);
Background.prototype.constructor = Background;
// Background.prototype

Background.prototype.draw = function (ctx) {
	//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	var width = Math.floor(gm.canvas.width);
	var heigth = Math.floor(gm.canvas.height);
	ctx.drawImage(this.spritesheet, gm.cam.leftX, gm.cam.topY, gm.cam.width, gm.cam.height, 0, 0, gm.cam.width, gm.cam.height);
};

Background.prototype.update = function () {

};

//no inheritance
function Collidable_background(spritesheet) {
	this.entityID = 3;
	this.spritesheet = spritesheet;
	this.game = gm;
	this.layer = 2;
	Entity.call(this, 0, 0);
};

Collidable_background.prototype = Object.create(Entity.prototype);
Collidable_background.prototype.constructor = Collidable_background;

Collidable_background.prototype.draw = function (ctx) {
	//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	var width = Math.floor(gm.canvas.width);
	var heigth = Math.floor(gm.canvas.height);
	ctx.drawImage(this.spritesheet, gm.cam.leftX, gm.cam.topY, gm.cam.width, gm.cam.height,
			0, 0, gm.cam.width, gm.cam.height);
};

Collidable_background.prototype.update = function () {

};