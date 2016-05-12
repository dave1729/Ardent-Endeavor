function Blue(x, y, cursor, battle) {
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
            if (gm.im.getClick())
            {
                if(!this.moved)
                {
                    if(this.x !== this.cursor.point.x || this.y !== this.cursor.point.y)
                    {
                        this.x = this.cursor.point.x;
                        this.y = this.cursor.point.y;
                        this.selected = false;
                        this.cursor.selected = false;
                        this.moved = true;
                        gm.im.currentgroup.click = null;
                    }
                }
            }
            if (!this.attack && this.moved)
            {
                if(gm.im.getClick())
                {
                    if(((this.x + 1) === this.cursor.point.x && this.y === this.cursor.point.y) ||
                        ((this.x - 1) === this.cursor.point.x && this.y === this.cursor.point.y) ||
                        (this.x === this.cursor.point.x && (this.y + 1) === this.cursor.point.y) ||
                        (this.x === this.cursor.point.x && (this.y - 1) === this.cursor.point.y))
                        {
                            // this.attack = true;
                            this.cursor.attack = {x: this.cursor.point.x, y: this.cursor.point.y};
                        }
                }
           }
           if(this.cursor.goodAttack)
           {
               this.attack = true;
               this.selected = false;
               this.cursor.selected = false;
               this.cursor.goodAttack = false;
               gm.im.currentgroup.click = null;
           }
            // if (gm.im.getRClick())
            // {
                
            //     console.log("I removed you")
            //     this.selected = false;
            //     this.cursor.selected = false;
            //     gm.im.currentgroup.rclick = null;
            // }
        }
        else if(gm.im.getClick())
        {
            // console.log("we are on top")
            
            if (this.cursor.point.x === this.x && this.cursor.point.y === this.y)
            {
                // console.log("I clicked you")
                if (!this.cursor.selected)
                {
                    // console.log("your selected")
                    this.selected = true;
                    this.cursor.selected = true;
                }
                gm.im.currentgroup.click = null;
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
        ctx.strokeStyle = "rgba(0, 0, 255, 1)";  
    }
    else
    {
        ctx.fillStyle = "rgba(0, 0, 255, 1)";
        ctx.strokeStyle = "rgba(0, 0, 255, 1)";    
    }     
    ctx.arc(this.x * 64 + 32,this.y * 64 + 32, 32, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
}

function Red(x, y, cursor, battle, enemyType)
{
    this.game = game;
    this.x = x;
    this.y = y;
    this.enemyType = enemyType;
    this.cursor = cursor;
    this.battle = battle;
    
    // this.enemyType.x = x * 64;
    // this.enemyType.y = y * 64;
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
    // ctx.beginPath();
    // ctx.strokeStyle = "rgba(255, 0, 0, 1)";
    // ctx.fillStyle  = "rgba(255, 0, 0, 1)";             
    // ctx.arc(this.x * 64 + 32,this.y * 64 + 32, 32, 0, 2 * Math.PI);
    // ctx.closePath();
    // ctx.fill();
}

// Stole from MDN
function* positionMaker(min, max) {
  while(true)
    yield Math.floor(Math.random() * (max - min + 1)) + min;
}

function Unit(spec)
{
    this.overworld = spec.overworld;
    this.animation = spec.overworld.animation;
    Entity.call(spec.x, spec.y, this);
}

Unit.prototype = Object.create(Entity.prototype);
Unit.prototype.constructor = Unit;

Unit.prototype.draw = function (ctx) {
    this.animation.drawEntity(gm.clockTick, ctx, this.x * 64, this.y * 64);
}

Unit.prototype.update = function () {
    if (gm.battle.currentPhase === gm.battle.playerPhase)
    {
        if (this.playerPhase)
            this.playerPhase();
    }
    else if (gm.battle.currentPhase === gm.battle.enemyPhase)
    {
        if (this.enemyPhase)
            this.enemyPhase();
    }
    else if (gm.battle.currentPhase === gm.battle.setupPhase)
    {
        if (this.setupPhase)
            this.setupPhase();
    }
}

function EnemyUnit(spec)
{
    this.ai = spec.ai;
    Unit.call(spec, this);
}

EnemyUnit.prototype = Object.create(Unit.prototype);
EnemyUnit.prototype.constructor = EnemyUnit;

EnemyUnit.prototype.enemyPhase = function (params) {
    //push this onto ai manager
}

function PlayerUnit(spec)
{
    Unit.call(spec, this)
}

PlayerUnit.prototype = Object.create(Unit.prototype);
PlayerUnit.prototype.constructor = PlayerUnit;




