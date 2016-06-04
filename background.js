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

function Title() {
	this.entityID = 131313;
	//this.animation = new Animation(gm.am.getAsset("./img/ArdentEndeavorTitle.png", 640, 640, 1, 1, 1, true, 1));
	this.spritesheet = gm.am.getAsset("./img/ArdentEndeavorTitle.png");
	this.game = gm;
	this.layer = 15;
	this.control = false;
	this.counter = gm.timer.gameTime;
	this.TitleTime = 5;
	Entity.call(this, 0, 0);
};

Title.prototype = Object.create(Entity.prototype);
Title.prototype.constructor = Title;
// Background.prototype

Title.prototype.draw = function (ctx) {
	//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	var width = Math.floor(gm.canvas.width);
	var heigth = Math.floor(gm.canvas.height);
	ctx.drawImage(this.spritesheet, 0, 0, 640, 640);
};

Title.prototype.update = function () {
	this.counter = gm.timer.gameTime;
	if(this.counter > this.TitleTime) {
		this.removeFromWorld = true;
	}
};