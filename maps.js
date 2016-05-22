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
	
	
	// function MapTeleportEvent(game, x, y, w, h, destMapid, destx, desty)
	
	/* Battle Maps */
	var bmap01 = new BattleMap({blockedTiles: [{x: 2, y: 7},{x: 4, y: 1}, {x: 4, y: 3}, {x: 5, y: 5},{x: 6, y: 2},{x: 6, y: 7}], backgroundLayer: new Background(gm, gm.am.getAsset("./img/LevelOneBattleGrassAndTree.png"))})
	
	var bmap02 = new BattleMap({blockedTiles: [], backgroundLayer: new Background(gm, gm.am.getAsset("./img/LevelOneBattleGrass.png"))})
	this.battleMaps.push(bmap01);
	this.battleMaps.push(bmap02);
	
	/* Map 1 - grasslands */
	var map01 = new Map(gm, 1,
		    new Background(gm, gm.am.getAsset("./img/Background_Layer.png")),
		    new Background(gm, gm.am.getAsset("./img/Foreground_Layer.png")),
		    new Collidable_background(gm, gm.am.getAsset("./img/Collision_Layer.png"))
	);
	//map01.addEntity(new MapTeleportEvent(gm, 400, 400, 50, 50, 2, 800, 800));
	//map01.addEntity(new MapTeleportEvent(gm, 700, 700, 50, 50, 2, 500, 500));
	
	//map01.addEntity(new Green(gm, 64, 64));
    //map01.addEntity(new Shark(gm, 64, 128));
    //map01.addEntity(new Fire(gm, 64, 256));
    map01.addEntity(new Bandit(gm, 8*TILE_SIZE, 4*TILE_SIZE));
    map01.addEntity(new Goblin(gm, 14*TILE_SIZE, 4*TILE_SIZE));
	map01.addEntity(new MapTeleportEvent(gm, 2024, 1730, 20, 50, 2, 3*TILE_SIZE, 1*TILE_SIZE+TILE_SIZE/2));
	
    map01.addEntity(new Billy(gm, 64, 256+64));
    map01.addEntity(new Chest(gm, 5*TILE_SIZE, 2*TILE_SIZE, 1, "Peanut"));
    map01.addEntity(new Chest(gm, 6*TILE_SIZE, 2*TILE_SIZE, 0, "Pinecone"));
    map01.addEntity(new Chest(gm, 7*TILE_SIZE, 2*TILE_SIZE, 2, "Excalibur"));
    map01.addEntity(new Door(gm, 3*TILE_SIZE, 3*TILE_SIZE, 0, false, null, 10*TILE_SIZE, 10*TILE_SIZE));
    this.addMap(map01);
    
    
    /* Map 2 - Temple */
    var map02 = new Map(gm, 2,
		    new Background(gm, gm.am.getAsset("./img/Background_Layer2.png")),
		    new Background(gm, gm.am.getAsset("./img/Foreground_Layer2.png")),
		    new Collidable_background(gm, gm.am.getAsset("./img/Collision_Layer2.png"))
	);
    map02.addEntity(new UndeadJacket(gm, 11*TILE_SIZE, 3*TILE_SIZE));
    map02.addEntity(new UndeadJacket(gm, 10*TILE_SIZE, 25*TILE_SIZE));
    map02.addEntity(new UndeadJacket(gm, 25*TILE_SIZE, 22*TILE_SIZE));
    map02.addEntity(new Skeleton(gm, 25*TILE_SIZE, 7*TILE_SIZE));
    map02.addEntity(new MapTeleportEvent(gm, 3*TILE_SIZE, 0*TILE_SIZE, 50, 50, 1, 1944, 1740));
	map02.addEntity(new MapTeleportEvent(gm, 1641, 390, 50, 50, 3, 15*TILE_SIZE+TILE_SIZE/2, 28*TILE_SIZE));
	
	//map02.addEntity(new Green(gm, 64, 64));
    //map02.addEntity(new Shark(gm, 64, 128));
    //map02.addEntity(new Fire(gm, 64, 256));
    this.addMap(map02);
	
    
    /* Map 2 - Temple */
    var map03 = new Map(gm, 3,
		    new Background(gm, gm.am.getAsset("./img/Background_Layer3.png")),
		    new Background(gm, gm.am.getAsset("./img/Foreground_Layer3.png")),
		    new Collidable_background(gm, gm.am.getAsset("./img/Collision_Layer3.png"))
	);
	//map03.addEntity(new MapTeleportEvent(gm, 128, 256, 50, 50, 1, 800, 800));
	map03.addEntity(new UndeadCreeper(gm, 3*TILE_SIZE, 22*TILE_SIZE));
	map03.addEntity(new YouWinEvent(gm, 9*TILE_SIZE, 0*TILE_SIZE, 2*TILE_SIZE, 1.3*TILE_SIZE));
	map03.addEntity(new Lich(gm, 6*TILE_SIZE, 5*TILE_SIZE));
	
	map03.addEntity(new MapTeleportEvent(gm, 15*TILE_SIZE, 29*TILE_SIZE+TILE_SIZE-20, TILE_SIZE*2, 20, 2, 1641, 470));
	
	//map03.addEntity(new Green(gm, 64, 64));
    //map03.addEntity(new Shark(gm, 64, 128));
    //map03.addEntity(new Fire(gm, 64, 256));
    this.addMap(map03);
	
	return true;
}