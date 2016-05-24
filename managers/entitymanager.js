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

EntityManager.prototype.removeEntityA = function (remove) {
    this.entities.forEach((entity) => {
        if(entity.x ===  remove.x && entity.y === remove.y)
        {
            entity.removeFromWorld = true;
        }
    })
}

EntityManager.prototype.removeImmediate = function (enemy)
{
    this.entities.slice(this.entities.indexOf(enemy), 1);
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
	
    for (var i = 0; i < this.entities.length; i++) {
        var entity = this.entities[i];
        if (!entity.removeFromWorld) {
        	if (!(entity instanceof Event)) {
        		entity.update();
        	} else if (entity.hitBox.getScreenX() < gm.surfaceWidth + 2*TILE_SIZE &&
        			entity.hitBox.getScreenX() > -2*TILE_SIZE &&
        			entity.hitBox.getScreenY() < gm.surfaceWidth + 2*TILE_SIZE &&
        			entity.hitBox.getScreenY() > -2*TILE_SIZE ) {
        		// Only update entity if it is in range of the screen.
        		entity.update();
        		//console.log(entity.constructor.name + " is being updated.");
        	}
        }
    }
    if (!gm.bm.currentBattle)
    {
        if (gm.bgCollision != null) {
            gm.bgCollision.update();
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
    gm.ctxCol.clearRect(0, 0, gm.surfaceWidth, gm.surfaceHeight);
    if (!gm.bm.currentBattle)
    {
        if (gm.bgCollision != null)
        {
            gm.bgCollision.draw(gm.ctxCol);
        }
    }
	gm.ctx.clearRect(0, 0, gm.surfaceWidth, gm.surfaceHeight);
    gm.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
    	if (!(this.entities[i] instanceof Event)) {
    		this.entities[i].draw(gm.ctx);
    	} else if (this.entities[i].hitBox.getScreenX() < gm.surfaceWidth + 1*TILE_SIZE &&
    			this.entities[i].hitBox.getScreenX() > -1*TILE_SIZE &&
    			this.entities[i].hitBox.getScreenY() < gm.surfaceWidth + 1*TILE_SIZE &&
    			this.entities[i].hitBox.getScreenY() > -1*TILE_SIZE ) {
    		// Only draw entities within range of the screen.
    		this.entities[i].draw(gm.ctx);
    		//console.log(this.entities[i].constructor.name + " is being drawn.");
    	}
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
    //Remove things marked for removable before caching
    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
        	this.entities[i].removeFromWorld = false;
            this.entities.splice(i, 1);
            
        }
    }
	this.tempEntities = _.cloneDeep(this.entities);
}

/* Restores the entities from cache */
EntityManager.prototype.restoreEntities = function () {
	this.entities = _.cloneDeep(this.tempEntities);
    //reset the references other places
    this.entities.forEach((entity) =>
    {
        if(entity.entityID === 0) 
            this.backgroundEntity = entity;
        if (entity.entityID === 1)
        {
            gm.player = entity;
            this.controlEntity = entity;
        }
    })
    
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