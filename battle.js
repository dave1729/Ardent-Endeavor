function Grid()
{
    this.visible = true;
    this.rows = 0;
    this.cols = 0;
}

Grid.prototype.update = function () {
    
}

Grid.prototype.draw = function (ctx) {
    if (this.visible)
    {
        ctx.strokeStyle = "black"
        //rows
        for (var r = 0; r < dungeonWidth; r += TILE_SIZE)
        {
            ctx.beginPath();
            ctx.moveTo(0, r);
            ctx.lineTo(dungeonWidth, r);
            ctx.stroke();
        }
        //cols
        for (var c = 0; c < dungeonHeight; c += TILE_SIZE)
        {
            ctx.beginPath();
            ctx.moveTo(c, 0);
            ctx.lineTo(c, dungeonHeight);
            ctx.stroke();    
        }
    }
}

function BattleOverlay(spec) 
{
    this.validLocations = spec.validLocations;
    this.highlightUnit = undefined;
    this.highlightSpawn = false;
    this.possibleMoves = [];
    this.possibleAttacks = [];
    Entity.call(this, 0, 0);
}

BattleOverlay.prototype.draw = function (ctx)
{
    if (this.highlightUnit)
    {
        if (!this.highlightUnit.moved)
        {
            //console.log("Highlighting Move")
            this.highlightPossibleMoves(ctx);
        }
        else if (!this.highlightUnit.attacked)
        {
            // console.log("Highlighting Attack")
            this.highlightPossibleAttacks(ctx);
        }
    }
    if (gm.bm.currentBattle.currentPhase === gm.bm.currentBattle.setupPhase)
    {
        this.highlightSpawns(ctx)    
    }
}

BattleOverlay.prototype.update = function () 
{
    if (gm.bm.currentBattle.currentPhase === gm.bm.currentBattle.playerPhase)
    {
        if (gm.bm.cursor.selected)
        {
            this.highlightUnit = gm.bm.cursor.selected;
            if (!this.highlightUnit.moved)
            {
                this.possibleMoves = this.highlightUnit.possibleMoves;
                // console.log(this.possibleMoves)
            }
            else if (!this.highlightUnit.attacked)
            {
                this.possibleAttacks = this.highlightUnit.possibleAttacks;
            }
        }
        else
        {
            this.possibleMoves = [];
            this.possibleAttacks = [];
        }
    }
}

BattleOverlay.prototype.highlightSpawns = function (ctx) {
    ctx.strokeStyle  = "rgba(0, 255, 0, 0.4)"; 
    ctx.fillStyle  = "rgba(0, 255, 0, 0.4)";     
    this.validLocations.forEach((point) => {
        ctx.fillRect(point.x * TILE_SIZE, point.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    })
}

BattleOverlay.prototype.highlightPossibleMoves = function (ctx) 
{
    ctx.strokeStyle  = "rgba(0, 0, 255, 0.4)"; 
    ctx.fillStyle  = "rgba(0, 0, 255, 0.4)";
    this.possibleMoves.forEach((point) => {
        ctx.fillRect(point.x * TILE_SIZE, point.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    })
        
}

BattleOverlay.prototype.highlightPossibleAttacks = function (ctx)
{
    ctx.strokeStyle  = "rgba(255, 0, 255, 0.5)";    
    ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
    this.possibleAttacks.forEach((point) => {
        ctx.fillRect(point.x * TILE_SIZE, point.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    })
}


function Cursor ()
{
    this.visible = true;
    this.goodAttack = false;
    this.selected = undefined;
    this.target = undefined;
    Entity.call(this, -TILE_SIZE, -TILE_SIZE);
}

Cursor.prototype.update = function () {
    if (this.getMouse())
    {
        let m = this.getMouse();
        this.x = m.x;
        this.y = m.y;
    }
    
    if (this.selected && this.target)
    {
        this.target.removeFromWorld = true;
        this.target = undefined;
    }
}

Cursor.prototype.draw = function (ctx) {
    if (this.visible)
    {
        if (this.good)
        {
            ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";  
            ctx.fillStyle  = "rgba(0, 0, 255, 0.5)";           
        }
        else
        {
            ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillStyle  = "rgba(0, 0, 0, 0.5)";
        }
        ctx.fillRect(this.x * 64,this.y * 64, 64, 64);    
    }
}

Cursor.prototype.screenToTile = function (point)
{
    return {x: Math.floor(point.x / TILE_SIZE) , y: Math.floor(point.y / TILE_SIZE)}
}

Cursor.prototype.getMouse = function () {
    let p = gm.im.getMouse()
    if(p)
    {
        return this.screenToTile(p)
    }
    return p;
}

Cursor.prototype.getClick = function () {
    let p = gm.im.getClick()
    if(p)
    {
        return this.screenToTile(p)
    }
    return p;
}

Cursor.prototype.getRClick = function () {
    let p = gm.im.getRClick()
    if(p)
    {
        return this.screenToTile(p)
    }
}

// Unit Placement
// Battl Start
// Battle End

function Battle(spec) 
{
    // Unit Spawning
    this.maxPlayers = spec.maxPlayers;
    this.validLocations = spec.validLocations;
    
    //Phases
    this.playerUnits = spec.playerUnits;
    this.enemyUnits = spec.enemyUnits;
    this.currentPhase = this.setupPhase;
    this.availableUnits = [];
    this.enemyType = spec.enemyType;
    this.spawnEnemies();
    gm.em.addEntity(new BattleOverlay(spec));
}

Battle.prototype.update = function ()
{
    this.currentPhase();
    // Units are not spawned
}

Battle.prototype.setupPhase = function () {
    gm.bm.cursor.good = true;
    if(gm.im.getClick())
    {
        if (this.validPlacement(gm.bm.cursor.x, gm.bm.cursor.y))
        {
            this.spawnPlayer();
            gm.im.currentgroup.click = null;
        }
    }
    if(this.maxPlayers === 0)
    {
        gm.bm.cursor.good = false;
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

Battle.prototype.spawnPlayer = function (params) {
    let spawn = new PlayerUnit({x: gm.bm.cursor.x, y :gm.bm.cursor.y});
    gm.em.addEntity(spawn);
    this.availableUnits.push(spawn);
    this.playerUnits.push(spawn);
    this.maxPlayers--;
}

Battle.prototype.validPlacement = function (x, y) {
    return this.validLocations.filter((point) => {
        return point.x === x && point.y === y;
    }).length  !== 0;
}

Battle.prototype.unitUsed = function (unit) 
{
    this.availableUnits.splice(this.availableUnits.indexOf(unit), 1);
}

Battle.prototype.resetUnits = function () {
    this.availableUnits = this.playerUnits;
}

Battle.prototype.disableInput = function () {
    gm.disableInput = true;
}

Battle.prototype.spawnEnemies = function () {
    var loc = positionMaker(1, 6);
    this.spawnEnemy(loc);
    this.spawnEnemy(loc);
    this.spawnEnemy(loc);
            
}
function* positionMaker(min, max) {
  while(true)
    yield Math.floor(Math.random() * (max - min + 1)) + min;
}

Battle.prototype.spawnEnemy = function (loc) {
    let spawn = new EnemyUnit({x: loc.next().value, y: loc.next().value, overworld: this.enemyType});
    // let spawn = new Red(loc.next().value, loc.next().value, gm.battle.cursor, this, this.enemyType);
    gm.em.addEntity(spawn);
    this.enemyUnits.push(spawn);
}


Battle.prototype.canSpawn = function (point) {
    
    
    return true;
}