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
    this.currentPhase = undefined;
    Entity.call(this, 0, 0);
}

BattleOverlay.prototype.draw = function (ctx)
{
    if (this.highlightUnit)
    {
        if(this.highlightUnit.selectedAction)
        {
            if (this.highlightUnit.selectedAction.move)
            {
                //console.log("Highlighting Move")
                this.highlightPossibleMoves(ctx);
            }
            if (this.highlightUnit.selectedAction.attack)
            {
                // console.log("Highlighting Attack")
                this.highlightPossibleAttacks(ctx);
            }
        }
        else
        {
            this.highlightPossibleMoves(ctx);
        }

    }
    if (gm.bm.currentBattle)
    {
        if (this.currentPhase === gm.bm.currentBattle.setupPhase)
            this.highlightSpawns(ctx)    
    }
}

BattleOverlay.prototype.update = function () 
{   
    if(gm.bm.currentBattle)
    {
        this.currentPhase = gm.bm.currentBattle.currentPhase
        if (this.currentPhase === gm.bm.currentBattle.playerPhase)
        {
            if (gm.bm.cursor.selected)
            {
                this.highlightUnit = gm.bm.cursor.selected;
                if (this.highlightUnit.selectedAction)
                {
                    if (this.highlightUnit.selectedAction.move)
                    {
                        this.possibleMoves = this.highlightUnit.possibleMoves;
                        // console.log(this.possibleMoves)
                    }
                    if (this.highlightUnit.selectedAction.attack)
                    {
                        this.possibleAttacks = this.highlightUnit.possibleAttacks;
                    }  
                }
                else
                {
                    this.possibleMoves = this.highlightUnit.possibleMoves;
                }

            }
            else
            {
                this.possibleMoves = [];
                this.possibleAttacks = [];
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

Cursor.prototype.deselect = function () {
    this.selected.deselect();
    this.selected = undefined;
}

Cursor.prototype.update = function () {
    if (this.getMouse())
    {
        let m = this.getMouse();
        this.x = m.x;
        this.y = m.y;
    }
    
    // if (this.selected && this.target)
    // {
    //     this.target.removeFromWorld = true;
    //     this.target = undefined;
    // }
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
    return p;
}

Cursor.prototype.isCellOccupied = function (point) 
{
    point = point ? point : {x: this.x, y: this.y};
    let occupy = gm.bm.currentBattle.getOccupiedCells();
    let result = undefined;
    occupy.forEach((object) => {
        if(point.x === object.x && point.y === object.y)
        {
            result = object;
        }
    })
    return result;
}

// Unit Placement
// Battl Start
// Battle End

function Battle(spec) 
{
    // Unit Spawning
    this.maxPlayers = spec.maxPlayers;
    this.validLocations = spec.validLocations;
    this.aiCalled = false;
    //Phases
    this.playerUnits = spec.playerUnits;
    this.enemyUnits = spec.enemyUnits;
    this.immovableTiles = spec.immovableTiles;
    this.currentPhase = this.setupPhase;
    this.availableUnits = [];
    this.enemyType = spec.enemyType;
}

Battle.prototype.init = function () {
    this.spawnEnemies();
    gm.em.addEntity(new BattleOverlay({validLocations: this.validLocations}));
}

Battle.prototype.getOccupiedCells = function () {
    let points = [];
    let units = [this.playerUnits, this.enemyUnits, this.immovableTiles]
    units.forEach((array) => {
        if(array)
        {
            array.forEach((object) => {
                points.push(object)
            })
        }
    })
    return points;
}

Battle.prototype.update = function ()
{
    this.currentPhase();
    // Units are not spawned
}

Battle.prototype.setupPhase = function () {
    gm.bm.cursor.good = true;
    let click = gm.bm.cursor.getClick();
    if(click)
    {
        if(!gm.bm.cursor.isCellOccupied())
        {
            if (this.validPlacement(click.x, click.y))
            {
                this.spawnPlayer();
            }
        }
        gm.im.currentgroup.click = undefined;
    }
    if(this.maxPlayers === 0)
    {
        gm.bm.cursor.good = false;
        gm.ai.newBattle(10, 10, this.playerUnits, this.enemyUnits, this.immovableTiles);
        this.currentPhase = this.playerPhase;
    }
}

Battle.prototype.resolveFight = function () {
    let attacker = gm.bm.cursor.selected;
    let defender = gm.bm.cursor.target;
    defender.health = defender.health - attacker.damage;
    if (defender.health <= 0)
    {
        if (defender.AIPackage)
        {
            this.enemyUnits.splice(this.enemyUnits.indexOf(defender), 1);
        }
        else
        {
            this.playerUnits.splice(this.playerUnits.indexOf(defender), 1);
        }
        gm.bm.cursor.target.removeFromWorld = true;
    }
    attacker.attacked = true;
    gm.bm.cursor.target = undefined;
}

Battle.prototype.playerPhase = function () {
    // if (this.availableUnits.length === 0)
    // {
    //     console.log("TURN DONE")
    //     this.currentPhase = this.enemyPhase;
    // }
    if (gm.bm.cursor.selected && gm.bm.cursor.target)
    {
        this.resolveFight();
        gm.bm.cursor.deselect();
        gm.im.currentgroup.click = undefined;
    }
    if(gm.im.checkInput("endTurn"))
    {
        console.log("TURN DONE")
        this.playerUnits.forEach((unit) =>
        {
            unit.selected = false;
        })
        gm.bm.cursor.selected = undefined;
        gm.bm.cursor.target = undefined;
        gm.im.setFalse("endTurn");
        // console.log("SWITCHING")
        this.currentPhase = this.enemyPhase;
    }
    if (this.enemyUnits.length === 0)
    {
        //End battle
        //Remove all entities from array
        console.log("Victory!")
        gm.endBattle();
    }
        //Check if t has been 
}

Battle.prototype.enemyPhase = function () {
    gm.im.setFalse("endTurn");
    if(!this.aiCalled)
    {
        // console.log("Running AI")
        this.aiCalled = true;
        gm.ai.runEnemyPhase(this.enemyPhaseTest.bind(this));
        // console.log("AI DONE")
    }
}

//Battle.prototype.animateMove = function (move) {
//	var tickSpeed = 0.02;
//	move.enemy.x = move.path[0].x;
//	move.enemy.y = move.path[0].y;
//	for (var i = 1; i < move.path.length; i++) {
//		var isMoving = true;
//		var tick = 0;
//		
//		
//		while (isMoving) {
//			tick += tickSpeed;
//			
//			
//			if (tick >= TILE_SIZE) {
//				console.log("Step done " + i);
//				isMoving = false;
//				move.enemy.x = move.path[i].x;
//				move.enemy.y = move.path[i].y;
//			}
//			gm.clockTick = gm.timer.tick();
//			gm.em.update();
//			gm.em.draw();
//			
//		}
//	}
//}

Battle.prototype.enemyPhaseTest = function (enemyMoves) 
{
    enemyMoves.forEach((move) => {
//    	this.animateMove(move);
        let dest = move.endPoint();
        move.enemy.x = dest.x;
        move.enemy.y = dest.y;
        if(move.isAttacking)
        {
            move.target.health = move.target.health - move.enemy.damage;
            if (move.target.health <= 0)
            {
                this.playerUnits.splice(this.playerUnits.indexOf(move.target), 1);
                move.target.removeFromWorld = true;
            }
        }
    })
    if (this.playerUnits.length === 0)
    {
        console.log("Defeat.")
        gm.endBattle();
    }
    if (this.enemyUnits.length === 0)
    {
        console.log("Victory!")
        gm.endBattle();
    }
    this.resetPUnitActions();
    gm.im.currentgroup.click = undefined;
    this.aiCalled = false;
    this.currentPhase = this.playerPhase;
}

Battle.prototype.resetPUnitActions = function () {
    this.playerUnits.forEach((unit) =>
    {
        unit.moved = false;
        unit.attacked = false;
    })
}

Battle.prototype.spawnPlayer = function (params) 
{
    console.log("./img/player" + this.maxPlayers + ".png")
    let over = new Player(gm.am.getAsset("./img/player" + this.maxPlayers + ".png"));
    
    over.x = gm.bm.cursor.x * TILE_SIZE;
    over.y = gm.bm.cursor.y * TILE_SIZE;
    over.animation.sheetWidth = 4;
    over.animation.frames = 12;
    over.animation.frameDuration = 0.2;
    let spawn = new PlayerUnit({overworld: over, x: gm.bm.cursor.x, y :gm.bm.cursor.y, health: 100, damage: 10});
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

    this.spawnEnemy();
    this.spawnEnemy();
    this.spawnEnemy();
    this.spawnEnemy();
        this.spawnEnemy();
}
function valueBetween(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function* idMaker(min, max)
{
  while(true)
    yield Math.floor(Math.random() * (max - min + 1)) + min;
}

Battle.prototype.spawnEnemy = function () {
    let point = {x: valueBetween(1, 9), y: valueBetween(1, 9)}
    let health1 = valueBetween(10, 30);
    let damage1 = valueBetween(0, 20);
    let clone = _.cloneDeep(this.enemyType)
    if(!gm.bm.cursor.isCellOccupied(point))
    {
        let spawn = new EnemyUnit({x: point.x, y: point.y, overworld: clone, health: health1, damage: damage1});
        gm.em.addEntity(spawn);
        this.enemyUnits.push(spawn);
    }
    else
    {
        this.spawnEnemy();
    }
}


Battle.prototype.canSpawn = function (point) {
    
    
    return true;
}