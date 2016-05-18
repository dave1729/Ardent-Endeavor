var gm = gm || {};
/* +------------------------------------------+ */
/* |        ===  ENTITY MANAGER  ===          | */
/* +------------------------------------------+ */
/**
 * Entity Manager deals directly with managing entities
 * in the game. It loads, saves, replaces, etc.
 * 
 * .addEntity(entity)
 * .removeAllEntities()
 * .cacheEntities()
 * .restoreEntities()
 * .removeEntity(entity)
 * 
 * @param game The game engine.
 */
function EntityManager() {
	this.entities = []
	this.tempEntities = [];
}

/* Adds an active entity to the game */
EntityManager.prototype.addEntity = function (entity) {
	//this.game.addEntity(entity);
	// console.log('added entity');
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

EntityManager.prototype.removeEntity = function (id) {
    this.entities.forEach((entity) => {
        if(entity.entityID === id)
        {
            entity.removeFromWorld = true;
        }
    })
}

EntityManager.prototype.update = function () {
	//var entitiesCount = this.entities.length;
	//console.log(this.entities);
	//console.log(this.entities.length);
	
	
    for (var i = 0; i < this.entities.length; i++) {
        var entity = this.entities[i];
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
        	this.entities[i].removeFromWorld = false;
            this.entities.splice(i, 1);
            
        }
    }
}

EntityManager.prototype.draw = function () {
	gm.ctx.clearRect(0, 0, gm.surfaceWidth, gm.surfaceHeight);
    gm.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
    	this.entities[i].draw(gm.ctx);
    }
    gm.ctx.restore();
}

/* Removes all active entities (including map and player) from the game */
EntityManager.prototype.removeAllEntities = function () {
    this.entities.forEach((entity) => {
        entity.removeFromWorld = true;
    })
    // console.log(this.tempEntities)
    this.update();
}

/* Creates a shallow copy of entities[] from game engine and stores in temp */
EntityManager.prototype.cacheEntities = function () {
	this.tempEntities = this.entities.slice(0);
}

/* Restores the entities from cache */
EntityManager.prototype.restoreEntities = function () {
	this.entities = this.tempEntities.slice(0);
}

/* Remove specific entity from active list. */
EntityManager.prototype.removeEntity = function (entity) {
	var index = this.entities.indexOf(entity);
	if (index > -1) {
		this.removeFromWorld = true;
		array.splice(index, 1);
	}
}

function Entity(x, y) {
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        gm.ctx.beginPath();
        gm.ctx.strokeStyle = "green";
        gm.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        gm.ctx.stroke();
        gm.ctx.closePath();
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