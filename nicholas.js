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
    if (this.battle.currentPhase === this.battle.playerPhase)
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
                    this.cursor.selected = false;
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
                this.cursor.selected = false;
                this.cursor.goodAttack = false;
            }
        if (this.game.rclick)
        {
            // console.log("I removed you")
            this.selected = false;
            this.cursor.selected = false;
            this.game.rclick = undefined;
        }
    }
    else if(this.game.click)
    {
        // console.log("we are on top")
        
        if (this.cursor.x == this.x && this.cursor.y === this.y)
        {
            // console.log("I clicked you")
            if (!this.cursor.selected)
            {
                // console.log("your selected")
                this.selected = true;
                this.cursor.selected = true;
            }
            this.game.click = undefined;
        }
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

function Red(game, x, y, cursor, battle)
{
    this.game = game;
    this.x = x;
    this.y = y;
    this.cursor = cursor;
    this.battle = battle;
    //this.layer = 3;
}
Red.prototype.update = function () {
    if(this.cursor.attack)
    {
        if((this.cursor.attack.x === this.x) && (this.cursor.attack.y === this.y))
        {
            this.cursor.goodAttack = true;
            this.battle.enemyUnits.splice(this.battle.enemyUnits.indexOf(this), 1);
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

function Unit()
{
    Entity.call(x, y, this);
}

Unit.prototype = Object.create(Entity.prototype);

