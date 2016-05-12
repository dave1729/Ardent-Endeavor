function BattleManager() {
    this.cursor = new Cursor();
    this.grid = new Grid();
    this.currentPhase = undefined;
    this.currentBattle = undefined;
}

BattleManager.prototype.createBattle = function () {
    //do some things to create cool battles
    var spec = {
        validLocations: [
            {x: 0,
            y: 2},
            {x: 0,
            y: 3},
            {x: 0,
            y: 4}
        ],
        maxPlayers: 3,
        playerUnits: [],
        enemyUnits: []
    }
    this.currentBattle = new Battle();
}

BattleManager.prototype.controls = function () {
    gm.im.addGroup("battle", gm.ctx);
    gm.im.currentgroup.addMouse();
    gm.im.currentgroup.addClick();
    gm.im.currentgroup.addRClick();
}

BattleManager.prototype.startBattle = function (spec) {
    this.controls();
    gm.em.addEntity(this.cursor);
    gm.em.addEntity(this.grid);
    this.currentPhase = this.setupPhase;     
}



BattleManager.prototype.update = function () {
    this.currentBattle.currentPhase();
}

function Battle(spec) 
{
    // Unit Spawning
    this.maxPlayers = spec.maxPlayers;
    this.validLocations = spec.validLocations;
    
    //Phases
    this.playerUnits = spec.playerUnits;
    this.enemyUnits = spec.enemyUnits;
    this.availableUnits = [];
     this.spawnEnemies();
}

Battle.prototype.update = function ()
{
    this.currentPhase();
    // Units are not spawned
}

Battle.prototype.setupPhase = function () {
    this.cursor.good = true;
    if(gm.im.getClick())
    {
        if (this.validPlacement(this.cursor.point))
        {
            this.spawnPlayer();
            gm.im.currentgroup.click = null;
        }
    }
    if(this.playerCount === 0)
    {
        this.cursor.good = false;
        this.unitsSpawned = true;
        this.playersTurn = true;
        this.currentPhase = this.playerPhase;
    }
}

Battle.prototype.playerPhase = function () {
    if (this.availableUnits.length === 0)
    {
        console.log("TURN DONE")
        this.currentPhase = this.enemyPhase;
    }
    if (this.enemyUnits.length === 0)
    {
        //End battle
        //Remove all entities from array
        console.log("Victory!")
    }
        //Check if t has been 
}

Battle.prototype.enemyPhase = function (params) {
    console.log("Enemies turn is taken.")
    if (this.playerUnits.length === 0)
    {
        console.log("Defeat.")
    }
    this.currentPhase = this.playerPhase;
        // AI LOGIC calls and stuff
}

