function Blue(x, y, cursor, battle) {
    this.battle = battle;
    this.moved = false;
    this.attacked = false;
    this.x = x;
    this.y = y;
    this.selected = false;
    this.cursor = gm.battle.cursor;
}

function Red(x, y, cursor, battle, enemyType)
{
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
function Unit(spec)
{
    let temp = new Shark(gm, 0, 0);
    this.overworld = spec.overworld;
    this.animation = spec.overworld.animation | temp.animation;
    this.range = spec.range | 3;
    this.speed = spec.speed | 1;
    Entity.call(this, spec.x, spec.y);
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
        {
            this.possibleMoves = calculatePossibleMoves();
            this.playerPhase();
        }
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

Unit.prototype.calculatePossibleMoves = function (spec)
{
   let x = this.x;
   let y = this.y;
   let dist = this.distance;
   let speed = this.speed;
   let points = [];
   let count = 0;
    for(var i = dist; i >= 1; i--) 
    {
        for(var j = dist; j >= 1; j--) 
        {
            
            if((Math.abs(i) + Math.abs(j)) <= dist)
            {
                points.push({x:i + x, y: j + y});
                count++;
                if(j !== 0 && i !== 0) {
                    points.push({x: (i * -1) + x, y: (j * -1) + y});
                    count++;
                }
                if(j !== 0) {
                    points.push({x:i + x, y:(j * -1) + y});
                    count++;
                }
                if(i !== 0) {
                    points.push({x: (i * -1) + x, y: j + y});
                    count++;
                }
            }
        }
    }
    return points;
}

function EnemyUnit(spec)
{
    this.ai = spec.ai;
    Unit.call(this, spec);
}

EnemyUnit.prototype = Object.create(Unit.prototype);
EnemyUnit.prototype.constructor = EnemyUnit;

EnemyUnit.prototype.enemyPhase = function (params) {
    //push this onto ai manager
}

function PlayerUnit(spec)
{
    this.moved = false;
    this.selected = false;
    this.cursor = gm.battle.cursor;
    Unit.call(this, spec);
}

PlayerUnit.prototype = Object.create(Unit.prototype);
PlayerUnit.prototype.constructor = PlayerUnit;

PlayerUnit.prototype.playerPhase = function ()
{
    if (this.selected)
    {     
        if (gm.im.getClick())
        {
            if(!this.moved)
            {
                if(this.x !== this.cursor.x || this.y !== this.cursor.y)
                {
                    this.x = this.cursor.x;
                    this.y = this.cursor.y;
                    this.selected = true;
                    this.cursor.selected = this;
                    this.moved = true;
                    gm.im.currentgroup.click = null;
                }
            }
        }
    }
}

// Blue.prototype.update = function () 
// {
//     if (this.battle.currentPhase === this.battle.playerPhase)
//     {
        
//             if (!this.attacked && this.moved)
//             {
//                 if(gm.im.getClick())
//                 {
//                     if(((this.x + 1) === this.cursor.x && this.y === this.cursor.y) ||
//                         ((this.x - 1) === this.cursor.x && this.y === this.cursor.y) ||
//                         (this.x === this.cursor.x && (this.y + 1) === this.cursor.y) ||
//                         (this.x === this.cursor.x && (this.y - 1) === this.cursor.y))
//                         {
//                             // this.cursor.target = gm.battle.currentBattle.
//                             // // this.attack = true;
//                             // this.cursor.attack = {x: this.cursor.point.x, y: this.cursor.point.y};
//                         }
//                         else
//                         {
//                             this.selected = false;
//                             this.cursor.selected = undefined;
//                         }
//                 }
//            }
//         //    if(this.cursor.goodAttack)
//         //    {
//         //        this.attacked = true;
//         //        this.selected = false;
//         //        this.cursor.selected = false;
//         //        this.cursor.goodAttack = false;
//         //        gm.im.currentgroup.click = null;
//         //    }
//             // if (gm.im.getRClick())
//             // {
                
//             //     console.log("I removed you")
//             //     this.selected = false;
//             //     this.cursor.selected = false;
//             //     gm.im.currentgroup.rclick = null;
//             // }
//         }
//         else if(gm.im.getClick())
//         {
//             // console.log("we are on top")
            
//             if (this.cursor.x === this.x && this.cursor.y === this.y)
//             {
//                 // console.log("I clicked you")
//                 if (!this.cursor.selected)
//                 {
//                     // console.log("your selected")
//                     this.selected = true;
//                     this.cursor.selected = this;
//                 }
//                 gm.im.currentgroup.click = null;
//             }
//         }
//     }
    
   
// }


PlayerUnit.prototype.draw = function (ctx) {
    
    // console.log("help");
    ctx.beginPath();
    if (this.selected)
    {
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


