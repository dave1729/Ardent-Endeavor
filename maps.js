/**
 * 
 */
MapManager.prototype.initialize = function () {
	
	/* TEMPLATE
	var map01 = new Map(mapid,
			bglayer,
			clayer 
	);
	map01.addEntity(new Enemy(
	this.addMap(map01);
	*/
	
	
	// function MapTeleportEvent(game, x, y, w, h, destMapid, destx, desty)
	
	/* Battle Maps */
	var bmap01 = new BattleMap({blockedTiles: [{x: 2, y: 7}, {x: 4, y: 1}, {x: 4, y: 3}, {x: 5, y: 5}, {x: 6, y: 2}, {x: 6, y: 7}], backgroundLayer: new Background(gm.am.getAsset("./img/LevelOneBattleGrassAndTree.png"))})
	var bmap02 = new BattleMap({blockedTiles: [], backgroundLayer: new Background(gm.am.getAsset("./img/LevelOneBattleGrass.png"))})
	var bmap03 = new BattleMap({blockedTiles: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0}, {x: 8, y: 0}, {x: 9, y: 0},
	                                           {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}, {x: 6, y: 1}, {x: 7, y: 1}, {x: 8, y: 1}, {x: 9, y: 1},
	                                           {x: 0, y: 8}, {x: 1, y: 8}, {x: 2, y: 8}, {x: 3, y: 8}, {x: 4, y: 8}, {x: 5, y: 8}, {x: 6, y: 8}, {x: 7, y: 8}, {x: 8, y: 8}, {x: 9, y: 8},
	                                           {x: 0, y: 9}, {x: 1, y: 9}, {x: 2, y: 9}, {x: 3, y: 9}, {x: 4, y: 9}, {x: 5, y: 9}, {x: 6, y: 9}, {x: 7, y: 9}, {x: 8, y: 9}, {x: 9, y: 9}],
	                                           backgroundLayer: new Background(gm.am.getAsset("./img/LevelOneBattleBoat.png"))})
	var bmap04 = new BattleMap({blockedTiles: [], backgroundLayer: new Background(gm.am.getAsset("./img/LevelTwoBattleGrass.png"))})
	var bmap05 = new BattleMap({blockedTiles: [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 6}, {x: 0, y: 7}, {x: 0, y: 8}, {x: 0, y: 9}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3}, {x: 2, y: 5}, {x: 2, y: 6}, {x: 2, y: 7}, {x: 2, y: 9},
	                                           {x: 3, y: 3}, {x: 3, y: 7}, {x: 3, y: 9}, {x: 4, y: 0}, {x: 4, y: 3}, {x: 4, y: 4}, {x: 4, y: 5}, {x: 4, y: 7}, {x: 4, y: 9}, {x: 5, y: 0}, {x: 5, y: 1}, {x: 5, y: 5}, {x: 5, y: 7}, {x: 5, y: 9},
	                                           {x: 6, y: 0}, {x: 6, y: 1}, {x: 6, y: 2}, {x: 6, y: 3}, {x: 6, y: 5}, {x: 6, y: 9}, {x: 7, y: 5}, {x: 7, y: 6}, {x: 7, y: 7}, {x: 7, y: 9}, {x: 8, y: 1}, {x: 8, y: 2}, {x: 8, y: 3}, {x: 8, y: 9},
	                                           {x: 9, y: 7}, {x: 9, y: 8}, {x: 9, y: 9}], backgroundLayer: new Background(gm.am.getAsset("./img/LevelTwoBattleMaze.png"))})
	var bmap06 = new BattleMap({blockedTiles: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0}, {x: 8, y: 0}, {x: 9, y: 0},
	                                           {x: 0, y: 9}, {x: 1, y: 9}, {x: 2, y: 9}, {x: 3, y: 9}, {x: 4, y: 9}, {x: 5, y: 9}, {x: 6, y: 9}, {x: 7, y: 9}, {x: 8, y: 9}, {x: 9, y: 9},
	                                           {x: 2, y: 2}, {x: 3, y: 2}, {x: 4, y: 2}, {x: 5, y: 2}, {x: 6, y: 2}, {x: 2, y: 3}, {x: 4, y: 5}, {x: 7, y: 5}, {x: 7, y: 6}, {x: 2, y: 6},
	                                           {x: 2, y: 7}, {x: 3, y: 7}, {x: 4, y: 7}], backgroundLayer: new Background(gm.am.getAsset("./img/LevelTwoBattleTree.png"))})
	var bmap07 = new BattleMap({blockedTiles: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0}, {x: 8, y: 0}, {x: 9, y: 0},
	                                           {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}, {x: 6, y: 1}, {x: 7, y: 1}, {x: 8, y: 1}, {x: 9, y: 1},
	                                           {x: 0, y: 7}, {x: 1, y: 7}, {x: 2, y: 7}, {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7}, {x: 6, y: 7}, {x: 7, y: 7}, {x: 8, y: 7}, {x: 9, y: 7},
	                                           {x: 0, y: 8}, {x: 1, y: 8}, {x: 2, y: 8}, {x: 3, y: 8}, {x: 4, y: 8}, {x: 5, y: 8}, {x: 6, y: 8}, {x: 7, y: 8}, {x: 8, y: 8}, {x: 9, y: 8},
	                                           {x: 0, y: 9}, {x: 1, y: 9}, {x: 2, y: 9}, {x: 3, y: 9}, {x: 4, y: 9}, {x: 5, y: 9}, {x: 6, y: 9}, {x: 7, y: 9}, {x: 8, y: 9}, {x: 9, y: 9}],
	                                           backgroundLayer: new Background(gm.am.getAsset("./img/LevelThreeBattleHallway.png"))})
	var bmap08 = new BattleMap({blockedTiles: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0}, {x: 8, y: 0}, {x: 9, y: 0},
	                                           {x: 0, y: 9}, {x: 1, y: 9}, {x: 2, y: 9}, {x: 3, y: 9}, {x: 4, y: 9}, {x: 5, y: 9}, {x: 6, y: 9}, {x: 7, y: 9}, {x: 8, y: 9}, {x: 9, y: 9},
	                                           {x: 0, y: 7}, {x: 0, y: 8}, {x: 9, y: 7}, {x: 9, y: 8}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}, {x: 6, y: 1}, {x: 3, y: 2}, {x: 4, y: 2},
	                                           {x: 5, y: 2}, {x: 6, y: 2}], backgroundLayer: new Background(gm.am.getAsset("./img/LevelThreeBattleHall.png"))})
	var bmap09 = new BattleMap({blockedTiles: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0}, {x: 8, y: 0}, {x: 9, y: 0}],
		                                      backgroundLayer: new Background(gm.am.getAsset("./img/LevelThreeBattleRoom.png"))})
	
	this.battleMaps.push(bmap01);
	this.battleMaps.push(bmap02);
	this.battleMaps.push(bmap03);
	this.battleMaps.push(bmap04);
	this.battleMaps.push(bmap05);
	this.battleMaps.push(bmap06);
	this.battleMaps.push(bmap07);
	this.battleMaps.push(bmap08);
	this.battleMaps.push(bmap09);
	
	/* Map 1 - Grasslands */
	var map01 = new Map(1,
		    new Background(gm.am.getAsset("./img/Background_Layer.png")),
		    new Background(gm.am.getAsset("./img/Foreground_Layer.png")),
		    new Collidable_background(gm.am.getAsset("./img/Collision_Layer.png"))
	);
	
	//ENEMIES
    map01.addEntity(new Bandit(18*TILE_SIZE, 21*TILE_SIZE));
    map01.addEntity(new Bandit(19*TILE_SIZE, 22*TILE_SIZE));
    map01.addEntity(new TreeMonster(15*TILE_SIZE, 4*TILE_SIZE));
    map01.addEntity(new TreeMonster(9*TILE_SIZE, 1*TILE_SIZE));
    map01.addEntity(new TreeMonster(19*TILE_SIZE, 6*TILE_SIZE));
    map01.addEntity(new Naga(14*TILE_SIZE, 27*TILE_SIZE));
    map01.addEntity(new Snake03(4*TILE_SIZE, 26*TILE_SIZE));
    map01.addEntity(new Kraken(21*TILE_SIZE, 25*TILE_SIZE));
    map01.addEntity(new Goblin(29*TILE_SIZE, 22*TILE_SIZE));
    map01.addEntity(new Bandit(17*TILE_SIZE, 23*TILE_SIZE));
    map01.addEntity(new BirdMonster(27*TILE_SIZE, 4*TILE_SIZE));
    map01.addEntity(new FlyingBug(23*TILE_SIZE, 7*TILE_SIZE));
    map01.addEntity(new BirdMonster(11*TILE_SIZE, 4*TILE_SIZE));
    map01.addEntity(new FlyingBug(29*TILE_SIZE, 2*TILE_SIZE));
    //End New Enemies
    
    //Pirate Girl
    map01.addEntity(new PirateGirl(23*TILE_SIZE, 13*TILE_SIZE));
    
    //This is David's Skip to Level 3 For Testing Teleport (behind the tree)
    //map01.addEntity(new MapTeleportEvent(32, 720, 5, 5, 3, 15*TILE_SIZE+TILE_SIZE/2, 28*TILE_SIZE));
    
    //Regular End of Level Teleport
	map01.addEntity(new MapTeleportEvent(2024, 1730, 20, 50, 2, 3*TILE_SIZE, 1*TILE_SIZE+TILE_SIZE/2));
	
	//Obvious Chests
    map01.addEntity(new Chest(19*TILE_SIZE, 19*TILE_SIZE, 2, Inventory.LIBRARY.PIRATE_HAT));
    map01.addEntity(new Chest(6*TILE_SIZE, 6*TILE_SIZE, 0, Inventory.LIBRARY.HEALTH_POTION, 12));
    map01.addEntity(new Chest(12*TILE_SIZE, 27*TILE_SIZE, 1, new Currency({value: 5, name: "Gold"})));
    map01.addEntity(new Chest(1*TILE_SIZE, 20*TILE_SIZE, 2, new Currency({value: 5, name: "Gold"})));
    map01.addEntity(new Chest(30*TILE_SIZE, 1*TILE_SIZE, 1, new Currency({value: 5, name: "Gold"})));
    map01.addEntity(new Chest(24*TILE_SIZE, 28*TILE_SIZE, 2, new Currency({value: 5, name: "Gold"})));
    
    //HIDDEN CHESTS
    map01.addEntity(new Chest(1*TILE_SIZE, 2*TILE_SIZE, 1, new Currency({value: 150, name: "Gold"})));
    map01.addEntity(new Chest(19*TILE_SIZE + 16, 1*TILE_SIZE - 12, 1, new Currency({value: 5, name: "Gold"})));
    map01.addEntity(new Chest(29*TILE_SIZE + 16, 21*TILE_SIZE - 12, 1, new Currency({value: 5, name: "Gold"})));
    map01.addEntity(new Chest(6*TILE_SIZE + 16, 14*TILE_SIZE - 12, 1, new Currency({value: 5, name: "Gold"})));
    map01.addEntity(new Chest(31*TILE_SIZE + 16, 9*TILE_SIZE - 12, 1, new Currency({value: 5, name: "Gold"})));
    
    //OLD UNUSED CODE
    map01.addEntity(new Billy(5*TILE_SIZE, 7*TILE_SIZE));
    //map01.addEntity(new Door(3*TILE_SIZE, 3*TILE_SIZE, 0, false, null, 10*TILE_SIZE, 10*TILE_SIZE));
    this.addMap(map01);
    
    
    /* Map 2 - Maze */
    var map02 = new Map(2,
		    new Background(gm.am.getAsset("./img/Background_Layer2.png")),
		    new Background(gm.am.getAsset("./img/Foreground_Layer2.png")),
		    new Collidable_background(gm.am.getAsset("./img/Collision_Layer2.png"))
	);
    
    //ENEMIES
    map02.addEntity(new StoneMonster(15*TILE_SIZE, 4*TILE_SIZE));
    map02.addEntity(new UndeadCreeper(19*TILE_SIZE, 6*TILE_SIZE));
    map02.addEntity(new UndeadCreeper(4*TILE_SIZE, 26*TILE_SIZE));
    map02.addEntity(new Zombie(29*TILE_SIZE, 22*TILE_SIZE));
    map02.addEntity(new UndeadJacket(17*TILE_SIZE, 23*TILE_SIZE));
    map02.addEntity(new Zombie(2*TILE_SIZE, 5*TILE_SIZE));    
    map02.addEntity(new UndeadJacket(11*TILE_SIZE, 3*TILE_SIZE));
    map02.addEntity(new UndeadJacket(10*TILE_SIZE, 25*TILE_SIZE));
    map02.addEntity(new UndeadJacket(25*TILE_SIZE, 22*TILE_SIZE));
    map02.addEntity(new Skeleton(25*TILE_SIZE, 7*TILE_SIZE));
    map02.addEntity(new StoneMonster(14*TILE_SIZE, 17*TILE_SIZE));
    map02.addEntity(new UndeadJacket(28*TILE_SIZE, 18*TILE_SIZE));
    map02.addEntity(new UndeadCreeper(24*TILE_SIZE, 10*TILE_SIZE));
    map02.addEntity(new UndeadCreeper(27*TILE_SIZE, 10*TILE_SIZE));
	
	//Obvious Chests
	map02.addEntity(new Chest(1*TILE_SIZE, 1*TILE_SIZE, 2, new Currency({value: 5, name: "Gold"})));
	map02.addEntity(new Chest(1*TILE_SIZE, 23*TILE_SIZE, 1, new Currency({value: 5, name: "Gold"})));
	map02.addEntity(new Chest(14*TILE_SIZE, 16*TILE_SIZE, 2, new Currency({value: 5, name: "Gold"})));
	map02.addEntity(new Chest(15*TILE_SIZE, 1*TILE_SIZE, 1, new Currency({value: 5, name: "Gold"})));
	map02.addEntity(new Chest(25*TILE_SIZE, 15*TILE_SIZE, 2, new Currency({value: 5, name: "Gold"})));
	
    //HIDDEN CHESTS
    map02.addEntity(new Chest(28*TILE_SIZE + 16, 26*TILE_SIZE - 12, 1, new Currency({value: 5, name: "Gold"})));
    map02.addEntity(new Chest(28*TILE_SIZE + 16, 15*TILE_SIZE - 12, 1, new Currency({value: 5, name: "Gold"})));
    map02.addEntity(new Chest(5*TILE_SIZE + 16, 1*TILE_SIZE - 12, 1, new Currency({value: 5, name: "Gold"})));
    
    //REALLY HIDDEN CHEST!!!
    map02.addEntity(new Chest(21*TILE_SIZE + 16, 1*TILE_SIZE - 12, 1, Inventory.LIBRARY.CASTLE_KEY));
    
    //Return to Level 1
    map02.addEntity(new MapTeleportEvent(3*TILE_SIZE, 0*TILE_SIZE, 50, 50, 1, 1944, 1740));
    
    //To Level 3 THIS HAS BEEN MOVED INTO THE ADD INVENTORY FUNCTION WHERE THE CHECKFORKEY IS
	//map02.addEntity(new MapTeleportEvent(1641, 390, 50, 50, 3, 15*TILE_SIZE+TILE_SIZE/2, 28*TILE_SIZE));
    
    this.addMap(map02);
	
    
    /* Map 3 - Castle */
    var map03 = new Map(3,
		    new Background(gm.am.getAsset("./img/Background_Layer3.png")),
		    new Background(gm.am.getAsset("./img/Foreground_Layer3.png")),
		    new Collidable_background(gm.am.getAsset("./img/Collision_Layer3.png"))
	);
	
    //ENEMIES
    map03.addEntity(new Slime(22*TILE_SIZE, 6*TILE_SIZE));
    map03.addEntity(new Slime(14*TILE_SIZE, 16*TILE_SIZE));
    map03.addEntity(new Slime(12*TILE_SIZE, 13*TILE_SIZE));
    map03.addEntity(new Slime(7*TILE_SIZE, 9*TILE_SIZE));
    map03.addEntity(new Slime(26*TILE_SIZE, 25*TILE_SIZE));
    map03.addEntity(new Slime(26*TILE_SIZE, 14*TILE_SIZE));
    map03.addEntity(new Slime(29*TILE_SIZE, 14*TILE_SIZE));
    map03.addEntity(new Slime(16*TILE_SIZE, 5*TILE_SIZE));
    map03.addEntity(new Slime(1*TILE_SIZE, 13*TILE_SIZE));
    map03.addEntity(new Devil(6*TILE_SIZE, 11*TILE_SIZE));
    map03.addEntity(new Mercenary(27*TILE_SIZE, 2*TILE_SIZE));
    map03.addEntity(new ThreeHeadedDog(23*TILE_SIZE, 23*TILE_SIZE));
    map03.addEntity(new ThreeHeadedDog(20*TILE_SIZE, 9*TILE_SIZE));
    map03.addEntity(new Ogre(4*TILE_SIZE, 7*TILE_SIZE));
    map03.addEntity(new Ogre(8*TILE_SIZE, 7*TILE_SIZE));
	map03.addEntity(new Mercenary(3*TILE_SIZE, 22*TILE_SIZE));
	map03.addEntity(new Lich(6*TILE_SIZE, 5*TILE_SIZE));
	map03.addEntity(new YouWinEvent(9*TILE_SIZE, 0*TILE_SIZE, 2*TILE_SIZE, 1.3*TILE_SIZE));
	
	//Obvious Chests
    map03.addEntity(new Chest(2*TILE_SIZE, 22*TILE_SIZE, 2, new Currency({value: 5, name: "Gold"})));
    map03.addEntity(new Chest(29*TILE_SIZE, 21*TILE_SIZE, 1, new Currency({value: 5, name: "Gold"})));
    map03.addEntity(new Chest(25*TILE_SIZE, 9*TILE_SIZE, 2, new Currency({value: 5, name: "Gold"})));
    map03.addEntity(new Chest(3*TILE_SIZE, 12*TILE_SIZE, 1, new Currency({value: 5, name: "Gold"})));
    map03.addEntity(new Chest(2*TILE_SIZE, 2*TILE_SIZE, 2, new Currency({value: 5, name: "Gold"})));
	
    //Return to Level 2
	map03.addEntity(new MapTeleportEvent(15*TILE_SIZE, 29*TILE_SIZE+TILE_SIZE-20, TILE_SIZE*2, 20, 2, 1641, 470));
	
    this.addMap(map03);
	
	return true;
}