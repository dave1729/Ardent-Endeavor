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
function EntityManager(game) {
	this.game = game;
	this.tempEntities = [];
}

/* Adds an active entity to the game */
EntityManager.prototype.addEntity = function (entity) {
	//this.game.addEntity(entity);
	console.log('added entity');
	this.game.entities.push(entity);
	if(entity.entityID === 1) this.game.controlEntity = entity;
	if(entity.entityID === 0) this.game.backgroundEntity = entity;
	//Sort entities by layer
	this.game.entities.sort(
			function(x, y)
			{
				return x.layer - y.layer;
			}
	);
}

/* Removes all active entities (including map and player) from the game */
EntityManager.prototype.removeAllEntities = function () {
	this.game.entities.length = 0;
}

/* Creates a shallow copy of entities[] from game engine and stores in temp */
EntityManager.prototype.cacheEntities = function () {
	this.tempEntities = this.game.entities.slice(0);
}

/* Restores the entities from cache */
EntityManager.prototype.restoreEntities = function () {
	this.game.entities = this.tempEntities.slice(0);
}

/* Remove specific entity from active list. */
EntityManager.prototype.removeEntity = function (entity) {
	var index = this.game.entities.indexOf(entity);
	if (index > -1) {
		this.removeFromWorld = true;
		array.splice(index, 1);
	}
}