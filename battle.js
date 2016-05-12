function Grid()
{
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
            ctx.beginPath();
            ctx.moveTo(0, r);
            ctx.lineTo(dungeonWidth, r);
            ctx.stroke();
        }
        //cols
        for (var c = 0; c < dungeonHeight; c += this.tileSize)
        {
            ctx.beginPath();
            ctx.moveTo(c, 0);
            ctx.lineTo(c, dungeonHeight);
            ctx.stroke();    
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




Battle.prototype.spawnPlayer = function (params) {
    let spawn = new Blue(this.cursor.point.x, this.cursor.point.y, this.cursor, this);
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