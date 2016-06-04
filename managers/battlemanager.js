function BattleManager() {
    this.cursor = new Cursor();
    this.grid = new Grid();
    this.battleUnits = [];
    this.currentBattle = undefined;
    this.maxPlayers = 3;
}

BattleManager.prototype.init = function () {
    this.createPlayers();
}

BattleManager.prototype.createPlayers = function ()
{
    this.battleUnits.push(new PlayerUnit({spriteSheet:gm.am.getAsset("./img/player1.png"), 
                                          x: 0, y : 0, health: 100, damage: 10, name: "Owl"}));
    this.battleUnits.push(new PlayerUnit({spriteSheet:gm.am.getAsset("./img/player2.png"), 
                                          x: 0, y : 0, health: 100, damage: 10, name: "Bear"}));
    this.battleUnits.push(new PlayerUnit({spriteSheet:gm.am.getAsset("./img/player3.png"), 
                                          x: 0, y : 0, health: 100, damage: 10, name: "Monkey"}));
}

BattleManager.prototype.createBattle = function (spec) {
    //do some things to create cool battles
    var map = gm.mm.battleMaps[spec.enemyType.battleMap];
	gm.em.addEntity(map.bgLayer);
    var spec = {
        validLocations: [
            {x: 0,
            y: 2},
            {x: 0,
            y: 3},
            {x: 0,
            y: 4}
        ],
        maxPlayers: this.maxPlayers,
        playerUnits: [],
        availableUnits: this.battleUnits.filter((unit) => { return unit.health !== 0}),
        enemyUnits: [],
        enemyType: spec.enemyType,
        immovableTiles: map.blockedTiles
    }
    this.currentBattle = new Battle(spec);
    this.currentBattle.init();
    
}

BattleManager.prototype.controls = function () {
    gm.im.addGroup("battle", gm.ctx);
    gm.im.currentgroup.addMouse();
    gm.im.addInput(new Input("endTurn", "e"))
    // gm.im.addInput(new Input("endTurnO", "o"))
}

BattleManager.prototype.startBattle = function (spec) {
    this.controls();
    this.createBattle(spec);
    gm.em.addEntity(this.cursor);
    gm.em.addEntity(this.grid);
    
    // this.currentPhase = this.currentBattle.setupPhase;     
}

BattleManager.prototype.draw = function (ctx)
{
    this.currentBattle.draw(ctx);
}

BattleManager.prototype.update = function () 
{
    this.currentBattle.currentPhase();
}
