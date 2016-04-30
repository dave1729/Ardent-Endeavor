/**
 * 
 */

MapManager.prototype.initialize = function () {
	
	/* TEMPLATE
	var map01 = new Map(this.game, mapid,
			bglayer,
			clayer 
	);
	map01.addEntity(new Enemy(
	this.addMap(map01);
	*/
	
	
	
	/* Map 1 - grasslands */
	var map01 = new Map(this.game, 1,
		    new Background(this.game, this.game.am.getAsset("./img/GrassOnlyBackground.png")),
		    new Collidable_background(this.game, this.game.am.getAsset("./img/collidable_background.png"))
	);
	map01.addEntity(new MapTeleportEvent(this.game, 400, 400, 50, 50, 2, 800, 800));
	map01.addEntity(new MapTeleportEvent(this.game, 700, 700, 50, 50, 2, 500, 500));
	
	map01.addEntity(new Green(this.game, 64, 64));
    map01.addEntity(new Shark(this.game, 64, 128));
    map01.addEntity(new Fire(this.game, 64, 256));
    this.addMap(map01);
    
    
    /* Map 2 - Temple */
    var map02 = new Map(this.game, 2,
		    new Background(this.game, this.game.am.getAsset("./img/temple.jpg")),
		    new Collidable_background(this.game, this.game.am.getAsset("./img/collidable_background.png"))
	);
	map02.addEntity(new MapTeleportEvent(this.game, 400, 400, 50, 50, 1, 800, 800));
	map02.addEntity(new MapTeleportEvent(this.game, 700, 700, 50, 50, 1, 500, 500));
	
	map02.addEntity(new Green(this.game, 64, 64));
    map02.addEntity(new Shark(this.game, 64, 128));
    map02.addEntity(new Fire(this.game, 64, 256));
    this.addMap(map02);
	
	
	return true;
}