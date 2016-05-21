
/* +------------------------------------------+ */
/* |          ===  MAP MANAGER  ===           | */
/* +------------------------------------------+ */
/**
 * Map Manager
 * 
 * .addMap (map)
 * .getMap (mapid) returns map
 * 
 */
function MapManager(game) {
	this.game = game;
	this.maps = [];
	this.battleMaps = [];
}

/* Adds a map to the list of maps. Checks to make sure MapID is unique. */
MapManager.prototype.addMap = function (map) {
	if (this.maps[map.id] != undefined) {
		console.error("Map ID: (" + map.id + ") is not unique, did not add Map!!!");
	} else {
		this.maps[map.id] = map;
	}
}
/* Retrieves map with the given mapid. */
MapManager.prototype.getMap = function (mapid) {
	return this.maps[mapid];
}

function BattleMap(spec) {
	this.bgLayer = spec.backgroundLayer;
	this.blockedTiles = spec.blockedTiles;
}


/**
 * Map Object. Manages a map's background image layers, the
 * spawn zones and entities that populate the map.
 * 
 * .addSpawnZone (spawnzone)
 * .addEntity (entity)
 * 
 */
function Map(game, mapid, backgroundLayer, collisionLayer, collisionMask) {
	this.id = mapid;
	this.bgLayer = backgroundLayer;
	this.cLayer = collisionLayer;
	this.cLayer.layer = 10;
	this.cMask = collisionMask;
	this.spawnZones = [];
	this.entities = [];
}
/* Adds spawn zone to the list. */
Map.prototype.addSpawnZone = function (spawnzone) {
	this.spawnZones.push(spawnzone);
}
/* Adds entity to the entity list. */
Map.prototype.addEntity = function (entity) {
	this.entities.push(entity);
}


/**
 * Spawn Zone Object. Will manage spawn zones on a map.
 * Can return random location in spawn zone for monster.
 * 
 * .addEnemy (entity)
 * .getRandomEnemy () returns enemy with random coordinates in zone.
 * 
 */
function SpawnZone(map, x, y, radius) {
	this.map = map;
	this.x = x;
	this.y = y;
	this.r = radius;
	this.enemies = [];
}

SpawnZone.prototype.addEnemy = function (entity) {
	this.enemies.push(entity);
}

/* Spawns a random enemy in random spot in spawn zone (not even distribution) */
SpawnZone.prototype.getRandomEnemy = function () {
	var enemy = enemies[Math.floor(Math.random() * (this.enemies.length))];
	var angle = Math.random() * 2 * Math.PI;
	var radius = Math.random() * this.r;
	enemy.x = Math.floor(this.x + radius * Math.cos(angle));
	enemy.y = Math.floor(this.y + radius * Math.sin(angle));
	
	return enemy;
}



/* +------------------------------------------+ */
/* |          ===  FADE EFFECT  ===           | */
/* +------------------------------------------+ */
//fadeOutRectangle(this.game.ctx, 10, 10, 100, 100, 123, 213, 50);
function fadeOutRectangle(ctx, x, y, w, h, r, g, b) {
    var steps = 50,
        dr = (255 - r) / steps, // how much red should be added each time
        dg = (255 - g) / steps, // green
        db = (255 - b) / steps, // blue
        i = 0, // step counter
        interval = setInterval(function() {
            ctx.fillStyle = 'rgb(' + Math.round(r + dr * i) + ','
                                   + Math.round(g + dg * i) + ','
                                   + Math.round(b + db * i) + ')';
            ctx.fillRect(x, y, w, h); // will redraw the area each time
            i++;
            if(i === steps) { // stop if done
                clearInterval(interval);
            }
        }, 30);
}




