window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

const TILE_SIZE = 64;

function GameEngine() {
    this.entities = [];
    this.controlEntity = null;
    this.backgroundEntity = null;
    this.ctx = null;
    this.im = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.mouse = {
        x: 0,
        y: 0
    }
    this.hitBoxVisible = null;
    
    this.am = null; // AssetManager
    
    this.mm = null; // MapManager
    this.em = null; // EntityManager
    this.sm = null; // SceneManager
}

GameEngine.prototype.init = function (ctx, AM, game) {
    this.ctx = ctx;
    this.im = new InputManager(ctx, "Dungeon");
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    this.disableInput = false;
    this.startInput();
    this.hitBoxVisible = true;
    
    this.am = AM;
    this.mm = new MapManager(game);
    this.em = new EntityManager(game);
    this.sm = new SceneManager(game);
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');
    this.im.start(this);
    console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
    if(entity.entityID === 1) this.controlEntity = entity;
    if(entity.entityID === 0) this.backgroundEntity = entity;
    //Sort entities by layer
    this.entities.sort(
    		function(x, y)
            {
            	return x.layer - y.layer;
            }
    );
}

GameEngine.prototype.removeEntity = function (id) {
    this.entities.forEach((entity) => {
        if(entity.entityID === id)
        {
            entity.removeFromWorld = true;
        }
    })
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    
    for (var i = 0; i < this.entities.length; i++) {
    	this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        if (!entity.removeFromWorld) {
        	//console.log("Update: " + entity.constructor.name);
            entity.update();
        }
    }

    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }
    this.click = undefined;
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    //console.log(this.haltLoop);
    //if (!this.haltLoop) {
    	this.update();
        this.draw();
    //}
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}


/**
 * Collision Boxes of entities
 * 
 * @param x left side of hitbox (offset from sprite x)
 * @param y top side of hitbox (offset from sprite y)
 * @param w Width of hitbox (relative to center)
 * @param h Height of hitbox (relative to center)
 */
function CollisionBox(entity, x, y, w, h) {
	this.entity = entity;
	this.offsetX = x;
	this.offsetY = y;
	this.width = w;
	this.height = h;
}
CollisionBox.prototype.getX = function () {
	return (this.entity.x + this.offsetX);
}
CollisionBox.prototype.getY = function () {
	return (this.entity.y + this.offsetY);
}
/* getScreenX() function is for non player entities. */
CollisionBox.prototype.getScreenX = function () {
	return (this.entity.x + this.offsetX) - this.entity.game.backgroundEntity.x;
}
CollisionBox.prototype.getScreenY = function () {
	return (this.entity.y + this.offsetY) - this.entity.game.backgroundEntity.y;
}

