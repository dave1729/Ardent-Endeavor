function Grid()
{
    this.ctx = gm.ctx;
    this.visible = true;
    this.tileSize = 64;
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
        for (var r = 0; r < dungeonWidth; r+= this.tileSize)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(0, r);
            this.ctx.lineTo(dungeonWidth, r);
            this.ctx.stroke();
        }
        //cols
        for (var c = 0; c < dungeonHeight; c += this.tileSize)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(c, 0);
            this.ctx.lineTo(c, dungeonHeight);
            this.ctx.stroke();    
        }
    }
}

function Cursor ()
{
    this.visible = true;
    this.goodAttack = false;
    this.point = {x: 0, y:0}
}

Cursor.prototype.update = function () {
    if (gm.im.getMouse())
        this.point = gm.im.getMouse();
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
        ctx.fillRect(this.point.x * 64,this.point.y * 64, 64, 64);    
    }
}

// Unit Placement
// Battl Start
// Battle End

function Battle(game, cursor, enemy)
 {
    this.game = game;
    this.currentPhase = this.setupPhase;
    // Unit Spawning
    this.playerCount = 3;
    this.validLocations = [
        {x: 0,
         y: 2},
        {x: 0,
         y: 3},
        {x: 0,
         y: 4},
    ];
    
    //Phases
    this.playerUnits = [];
    this.enemyType = enemy;
    this.enemyUnits = [];
    this.availableUnits = [];
    this.cursor = cursor;
    this.init();
}

Battle.prototype.controls = function () {
	//var temp = gm.im.currentgroup.name;
	gm.im.addGroup("battle");
	//console.log(gm.im.currentgroup);
	gm.im.currentgroup.addMouse();
	// gm.im.addInput(new Input("up", 'w'));
	// gm.im.addInput(new Input("down", 's'));
	// gm.im.addInput(new Input("left", 'a'));
	// gm.im.addInput(new Input("right", 'd'));
	// gm.im.addInput(new Input("menu", 'i'));
	// gm.im.addInput(new Input("confirm", 'e'));
	// gm.im.changeCurrentGroupTo(temp);
}

Battle.prototype.init = function (params) {
    this.spawnEnemies();
    this.controls();
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

Battle.prototype.spawnPlayer = function (params) {
    var spawn = new Blue(this.cursor.point.x, this.cursor.point.y, this.cursor, this);
    gm.em.addEntity(spawn);
    this.availableUnits.push(spawn);
    this.playerUnits.push(spawn);
    this.playerCount--;
}

Battle.prototype.validPlacement = function (point) {
    return this.validLocations.filter((validPoint) => {
        return validPoint.x === point.x && validPoint.y === point.y;
    }).length  !== 0;
}

Battle.prototype.draw = function (ctx) {
    if (this.currentPhase === this.setupPhase)
    {
        this.highlightSpawns(ctx)    
    }
}

Battle.prototype.highlightSpawns = function (ctx) {
    ctx.strokeStyle  = "rgba(0, 255, 0, 0.4)"; 
    ctx.fillStyle  = "rgba(0, 255, 0, 0.4)";     
    this.validLocations.forEach((point) => {
        ctx.fillRect(point.x * 64, point.y * 64, 64, 64);
    })
}

Battle.prototype.unitUsed = function (unit) 
{
    this.availableUnits.splice(this.availableUnits.indexOf(unit), 1);
}

Battle.prototype.resetUnits = function () {
    this.availableUnits = this.playerUnits;
}

Battle.prototype.disableInput = function () {
    this.game.disableInput = true;
}

Battle.prototype.spawnEnemies = function () {
    var loc = positionMaker(1, 6);
    this.spawnEnemy(loc);
    this.spawnEnemy(loc);
    this.spawnEnemy(loc);
            
}

Battle.prototype.spawnEnemy = function (loc) {
    let spawn = new Red(this.game, loc.next().value, loc.next().value, this.cursor, this, this.enemyType);
    this.game.em.addEntity(spawn);
    this.enemyUnits.push(spawn);
}


Battle.prototype.canSpawn = function (point) {
    
    
    return true;
}