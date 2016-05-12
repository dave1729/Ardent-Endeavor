/**
 * 
 */
MapManager.prototype.initialize = function () {
	
	/* TEMPLATE
	var map01 = new Map(gm, mapid,
			bglayer,
			clayer 
	);
	map01.addEntity(new Enemy(
	this.addMap(map01);
	*/
	
	
	
	/* Map 1 - grasslands */
	var map01 = new Map(gm, 1,
		    new Background(gm, gm.am.getAsset("./img/GrassOnlyBackground.png")),
		    new Collidable_background(gm, gm.am.getAsset("./img/collidable_background.png"))
	);
	map01.addEntity(new MapTeleportEvent(gm, 400, 400, 50, 50, 2, 800, 800));
	map01.addEntity(new MapTeleportEvent(gm, 700, 700, 50, 50, 2, 500, 500));
	
	map01.addEntity(new Green(gm, 64, 64));
    map01.addEntity(new Shark(gm, 64, 128));
    map01.addEntity(new Fire(gm, 64, 256));
    map01.addEntity(new Billy(gm, 64, 256+64));
    this.addMap(map01);
    
    
    /* Map 2 - Temple */
    var map02 = new Map(gm, 2,
		    new Background(gm, gm.am.getAsset("./img/temple.jpg")),
		    new Collidable_background(gm, gm.am.getAsset("./img/collidable_background.png"))
	);
	map02.addEntity(new MapTeleportEvent(gm, 400, 400, 50, 50, 1, 800, 800));
	map02.addEntity(new MapTeleportEvent(gm, 700, 700, 50, 50, 1, 500, 500));
	
	map02.addEntity(new Green(gm, 64, 64));
    map02.addEntity(new Shark(gm, 64, 128));
    map02.addEntity(new Fire(gm, 64, 256));
    this.addMap(map02);
	
	
	return true;
}