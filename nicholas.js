function Grid(game, map) {
    this.game = game;
    this.ctx = this.game.ctx;
    this.map = map;
    this.visible = false;
    this.tileSize = 64;
    this.rows = 0;
    this.cols = 0;
}

Grid.prototype.update = function () {
    if(this.game.b || testingMode)
    {
        this.visible = true;
    }
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

function Cursor (game, map)
{
    this.game = game;
    this.visible = false;
    this.x = 0;
    this.y = 0;
}

Cursor.prototype.update = function () {
    
    if (this.game.b)
    {
        // console.log(this.x, this.y)
        this.x = this.game.mouse.x;
        this.y = this.game.mouse.y;
        this.visible = true;
    }
    // if (this.mouse.click)
    // {
    //     // this.game.addEntity(new )
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
        // else if (this.bad)
        // {
        //     ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
        //     ctx.fillStyle  = "rgba(255, 0, 0, 0.5)";
        // }
        else
        {
            ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillStyle  = "rgba(0, 0, 0, 0.5)";
        }
        ctx.fillRect(this.x * 64,this.y * 64, 64,64);    
    }
}

function tileToWorldLeftTop(x, y) {
    
    
}

function Battle(game, cursor)
 {
    this.game = game;
    this.enemiesSpawned = false;
    this.cursor = cursor;
    this.playerCount = 0;
}

Battle.prototype.update = function () {
    if(this.game.b && !this.enemiesSpawned)
    {
        this.spawnEnemies();
        this.enemiesSpawned = true;
    }
    if (this.game.b && this.playerCount < 3)
    {
        this.cursor.good = true;
        if(this.game.click)
        {
            this.game.addEntity(new Player(this.game, this.game.click.x, this.game.click.y, this.cursor))
            this.playerCount++;
            this.game.click = undefined;
        }
        if(this.playerCount === 3)
        {
            this.cursor.good = false;
        }
    }
    
}

Battle.prototype.draw = function (ctx) {
}

Battle.prototype.disableInput = function () {
    this.game.disableInput = true;
}

Battle.prototype.spawnEnemies = function () {
    var loc = positionMaker(0, 6);
    
    this.game.addEntity(new Enemy(this.game, loc.next().value, loc.next().value, this.cursor))
    this.game.addEntity(new Enemy(this.game, loc.next().value, loc.next().value, this.cursor))
    
}

function Player(game, x, y, cursor) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.cursor = cursor;
}

Player.prototype.update = function (ctx) {
    // if(this.cursor.x == this.x && this.cursor.y === this.y)
    // {
    //     console.log("help")
    //     this.removeFromWorld = true;
    // }
}

Player.prototype.draw = function (ctx) {
    // console.log("help");
    ctx.beginPath();
                ctx.strokeStyle = "rgba(0, 0, 255, 1)";  
            ctx.fillStyle  = "rgba(0, 0, 255, 1)";      
    ctx.arc(this.x * 64 + 32,this.y * 64 + 32, 32, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
}


function Enemy(game, x, y, cursor)
{
    this.game = game;
    this.x = x;
    this.y = y;
    this.cursor = cursor;
    //this.layer = 3;
}
Enemy.prototype.update = function (ctx) {
    if(this.cursor.x == this.x && this.cursor.y === this.y)
    {
        this.removeFromWorld = true;
    }
}

Enemy.prototype.draw = function (ctx) {
    // console.log("help");
    ctx.beginPath();
                ctx.strokeStyle = "rgba(255, 0, 0, 1)";
            ctx.fillStyle  = "rgba(255, 0, 0, 1)";
    ctx.arc(this.x * 64 + 32,this.y * 64 + 32, 32, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
}

// Stole from MDN
function* positionMaker(min, max) {
  while(true)
    yield Math.floor(Math.random() * (max - min + 1)) + min;
}