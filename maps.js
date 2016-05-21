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
		    new Background(gm, gm.am.getAsset("./img/Background_Layer.png")),
		    new Background(gm, gm.am.getAsset("./img/Foreground_Layer.png")),
		    new Collidable_background(gm, gm.am.getAsset("./img/Collision_Layer.png"))
	);
	map01.addEntity(new MapTeleportEvent(gm, 1984, 1728, 50, 50, 2, 512, 448));
	
	map01.addEntity(new Green(gm, 64, 64));
    map01.addEntity(new Shark(gm, 64, 128));
    map01.addEntity(new Fire(gm, 64, 256));
    map01.addEntity(new Billy(gm, 64, 256+64));
    map01.addEntity(new Chest(gm, 5*TILE_SIZE, 2*TILE_SIZE, 1, "Peanut"));
    map01.addEntity(new Chest(gm, 6*TILE_SIZE, 2*TILE_SIZE, 0, "Pinecone"));
    map01.addEntity(new Chest(gm, 7*TILE_SIZE, 2*TILE_SIZE, 2, "Excalibur"));
    this.addMap(map01);
    
    
    /* Map 2 - Temple */
    var map02 = new Map(gm, 2,
		    new Background(gm, gm.am.getAsset("./img/Background_Layer2.png")),
		    new Background(gm, gm.am.getAsset("./img/Foreground_Layer2.png")),
		    new Collidable_background(gm, gm.am.getAsset("./img/Collision_Layer2.png"))
	);
	map02.addEntity(new MapTeleportEvent(gm, 1641, 390, 50, 50, 3, 896, 1600));
	
	map02.addEntity(new Green(gm, 64, 64));
    map02.addEntity(new Shark(gm, 64, 128));
    map02.addEntity(new Fire(gm, 64, 256));
    this.addMap(map02);
	
    
    /* Map 2 - Temple */
    var map03 = new Map(gm, 3,
		    new Background(gm, gm.am.getAsset("./img/Background_Layer3.png")),
		    new Background(gm, gm.am.getAsset("./img/Foreground_Layer3.png")),
		    new Collidable_background(gm, gm.am.getAsset("./img/Collision_Layer3.png"))
	);
	map03.addEntity(new MapTeleportEvent(gm, 128, 256, 50, 50, 1, 800, 800));
	
	map03.addEntity(new Green(gm, 64, 64));
    map03.addEntity(new Shark(gm, 64, 128));
    map03.addEntity(new Fire(gm, 64, 256));
    this.addMap(map03);
	
	return true;
}