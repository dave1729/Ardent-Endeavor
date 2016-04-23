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
    this.goodAttack = false;
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
    this.BlueCount = 0;
}

Battle.prototype.update = function () {
    if(this.game.b && !this.enemiesSpawned)
    {
        this.spawnEnemies();
        this.enemiesSpawned = true;
    }
    if (this.game.b && this.BlueCount < 3)
    {
        this.cursor.good = true;
        if(this.game.click)
        {
            if (this.cursor.x === 0 && (this.cursor.y === 2 || this.cursor.y === 3 || this.cursor.y === 4))
            {
                this.game.addEntity(new Blue(this.game, this.game.click.x, this.game.click.y, this.cursor, this))
                this.BlueCount++;
                this.game.click = undefined;
            }
        }
        if(this.BlueCount === 3)
        {
            this.cursor.good = false;
        }
    }
    
}

Battle.prototype.draw = function (ctx) {
    if (this.game.b && this.BlueCount !== 3)
    {
        ctx.strokeStyle  = "rgba(0, 255, 0, 0.4)"; 
        ctx.fillStyle  = "rgba(0, 255, 0, 0.4)";      
        ctx.fillRect(0, 2 * 64, 64, 64);
        ctx.fillRect(0, 3 * 64, 64, 64);    
        ctx.fillRect(0, 4 * 64, 64, 64);        
    }
}

Battle.prototype.disableInput = function () {
    this.game.disableInput = true;
}

Battle.prototype.spawnEnemies = function () {
    var loc = positionMaker(1, 6);
    this.game.addEntity(new Red(this.game, loc.next().value, loc.next().value, this.cursor))
    this.game.addEntity(new Red(this.game, loc.next().value, loc.next().value, this.cursor))
    this.game.addEntity(new Red(this.game, loc.next().value, loc.next().value, this.cursor))
    // this.game.addEntity(new Red(this.game, loc.next().value, loc.next().value, this.cursor))
    // this.game.addEntity(new Red(this.game, loc.next().value, loc.next().value, this.cursor))
    // this.game.addEntity(new Red(this.game, loc.next().value, loc.next().value, this.cursor))
    // this.game.addEntity(new Red(this.game, loc.next().value, loc.next().value, this.cursor))
    // this.game.addEntity(new Red(this.game, loc.next().value, loc.next().value, this.cursor))
            
}

function Blue(game, x, y, cursor, battle) {
    this.game = game;
    this.battle = battle;
    this.moved = false;
    this.attack = false;
    this.x = x;
    this.y = y;
    this.selected = false;
    this.cursor = cursor;
}

Blue.prototype.update = function () 
{
    if (this.selected)
    {
        
        if (this.game.click)
        {
            if(!this.moved)
            {
                if(this.x !== this.cursor.x || this.y !== this.cursor.y)
                {
                    this.x = this.cursor.x;
                    this.y = this.cursor.y;
                    this.selected = false;
                    this.game.selected = false;
                    this.moved = true;
                    this.game.click = undefined;
                }
            }
        }
         if (!this.attack && this.moved)
            {
                if(this.game.click)
                    if(((this.x + 1) === this.cursor.x && this.y === this.cursor.y) ||
                    ((this.x - 1) === this.cursor.x && this.y === this.cursor.y) ||
                    (this.x === this.cursor.x && (this.y + 1) === this.cursor.y) ||
                    (this.x === this.cursor.x && (this.y - 1) === this.cursor.y))
                    {
                        // this.attack = true;
                        this.cursor.attack = {x: this.cursor.x, y: this.cursor.y};
                    }
            }
            
            if(this.cursor.goodAttack)
            {
                this.attack = true;
                this.selected = false;
                this.game.selected = false;
                this.cursor.goodAttack = false;
            }
            // else
            // {
            //     this.attack = false;
            // }
        //console.log("I am selected")
        if (this.game.rclick)
        {
            // console.log("I removed you")
            this.selected = false;
            this.game.selected = false;
            this.game.rclick = undefined;
        }
    }
    else if(this.game.click)
    {
        // console.log("we are on top")
        
        if (this.cursor.x == this.x && this.cursor.y === this.y)
        {
            // console.log("I clicked you")
            if (!this.game.selected)
            {
                // console.log("your selected")
                this.selected = true;
                this.game.selected = true;
            }
            this.game.click = undefined;
        }
    }
   
}

Blue.prototype.draw = function (ctx) {
    
    // console.log("help");
    ctx.beginPath();
    if (this.selected)
    {
        if (this.moved)
        {
            ctx.strokeStyle  = "rgba(255, 0, 255, 1)";    
            ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
            if(!this.attack)
            {
                ctx.fillRect((this.x + 1) * 64, this.y * 64, 64, 64);
                ctx.fillRect((this.x - 1) * 64, this.y * 64, 64, 64);
                ctx.fillRect(this.x * 64, (this.y + 1) * 64, 64, 64);
                ctx.fillRect(this.x * 64, (this.y - 1) * 64, 64, 64);
            } 
        }
        ctx.fillStyle = "rgba(0, 255, 0, 1)";
    }
    else
    {
        ctx.fillStyle = "rgba(0, 0, 255, 1)";  
    }
    ctx.strokeStyle  = "rgba(0, 0, 255, 1)";      
    ctx.arc(this.x * 64 + 32,this.y * 64 + 32, 32, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
}

function Red(game, x, y, cursor)
{
    this.game = game;
    this.x = x;
    this.y = y;
    this.cursor = cursor;
    //this.layer = 3;
}
Red.prototype.update = function () {
    if(this.cursor.attack)
    {
        if((this.cursor.attack.x === this.x) && (this.cursor.attack.y === this.y))
        {
            this.cursor.goodAttack = true;
            this.removeFromWorld = true;
        }
    }
}

Red.prototype.draw = function (ctx) {
    // console.log("help");
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 0, 0, 1)";
    ctx.fillStyle  = "rgba(255, 0, 0, 1)";             
    ctx.arc(this.x * 64 + 32,this.y * 64 + 32, 32, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}

// Stole from MDN
function* positionMaker(min, max) {
  while(true)
    yield Math.floor(Math.random() * (max - min + 1)) + min;
}