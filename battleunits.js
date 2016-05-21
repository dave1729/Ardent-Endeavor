// function Blue(x, y, cursor, battle) {
//     this.battle = battle;
//     this.moved = false;
//     this.attacked = false;
//     this.x = x;
//     this.y = y;
//     this.selected = false;
//     this.cursor = gm.battle.cursor;
// }

// function Red(x, y, cursor, battle, enemyType)
// {
// }
// Red.prototype.update = function () {
//     if(this.cursor.attack)
//     {
//         if((this.cursor.attack.x === this.x) && (this.cursor.attack.y === this.y))
//         {
//             this.cursor.goodAttack = true;
//             this.battle.enemyUnits.splice(this.battle.enemyUnits.indexOf(this), 1);
//             this.removeFromWorld = true;
//         }
//     }
// }

function Unit(spec)
{
    this.overworld = spec.overworld;
    this.animation = this.overworld.animation;
    this.attackRange = 1;
    this.moveRange = 3;
    
    // Used for animating during battle;
    this.xOffset = 0;
    this.yOffset = 0;
    
    Entity.call(this, spec.x, spec.y);
}

Unit.prototype = Object.create(Entity.prototype);
Unit.prototype.constructor = Unit;

Unit.prototype.draw = function (ctx) {
	var location = {x: this.x * TILE_SIZE,
					y: this.y * TILE_SIZE,
					xOffset: this.xOffset,
					yOffset: this.yOffset };
	this.overworld.draw(ctx, location);
    //this.animation.drawEntity(gm.clockTick, ctx, this.x * TILE_SIZE, this.y * TILE_SIZE);
}

Unit.prototype.update = function () {
    if(gm.bm.currentBattle)
    {
            if (gm.bm.currentBattle.currentPhase === gm.bm.currentBattle.playerPhase)
    {
        if (this.playerPhase)
        {
            this.playerPhase();
        }
    }
    else if (gm.bm.currentBattle.currentPhase === gm.bm.currentBattle.enemyPhase)
    {
        if (this.enemyPhase)
            this.enemyPhase();
    }
    else if (gm.bm.currentBattle.currentPhase === gm.bm.currentBattle.setupPhase)
    {
        if (this.setupPhase)
            this.setupPhase();
    }
    }

}

Unit.prototype.calculateActionRadius = function (spec)
{
   let x = this.x;
   let y = this.y;
   let dist = spec.actionRange;
   let offset = spec.offset
   let points = [];
   let count = 0;
    for(var i = dist; i >= offset; i--) 
    {
        for(var j = dist; j >= offset; j--) 
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
    this.AIPackage = gm.ai.AIPackages.Berserker;
    this.health = spec.health;
    this.damage = spec.damage;
    Unit.call(this, spec);
}

EnemyUnit.prototype = Object.create(Unit.prototype);
EnemyUnit.prototype.constructor = EnemyUnit;

function PlayerUnit(spec)
{
    spec.overworld = new Bandit(gm, spec.x, spec.y);
    this.moved = false;
    this.selected = false;
    this.selectedAction = {move: false, attack: false}
    this.cursor = gm.bm.cursor;
    this.health = spec.health;
    this.damage = spec.damage;
    this.possibleMoves = [];
    this.possibleAttacks = [];
    Unit.call(this, spec);
}

PlayerUnit.prototype = Object.create(Unit.prototype);
PlayerUnit.prototype.constructor = PlayerUnit;

PlayerUnit.prototype.draw = function (ctx)
{
    if (this.selected)
    {   
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 255, 0, 1)";
        ctx.strokeStyle = "rgba(0, 0, 255, 1)"; 
        ctx.arc(this.x * 64 + 32,this.y * 64 + 32, 32, 0, 2*Math.PI);
        ctx.closePath();
        ctx.fill();
    }   
    Unit.prototype.draw.call(this, ctx);
}

PlayerUnit.prototype.kill = function () 
{
    this.removeFromWorld = true;
}

PlayerUnit.prototype.deselect = function () {
    this.selected = false;
}

PlayerUnit.prototype.validAction = function (validActions, point)
{
    var result = false;
    if(this.x !== this.cursor.x || this.y !== this.cursor.y)
    {
        validActions.forEach((valid) => {
            if (point.x === valid.x && point.y === valid.y)
            {
                result = true;
            }
        })
    }
    return result;
}

PlayerUnit.prototype.isAvailable = function ()
{
    if (gm.bm.currentBattle.availableUnits.includes(this))
    {
        return true;
    }
    return false;
}

PlayerUnit.prototype.moveSelected = function ()
{
    if (gm.showUI)
    {
        this.possibleMoves = this.calculateActionRadius({
            actionRange: this.moveRange,
            offset: 0
        });
        gm.closeBattleMenu();
        this.cursor.visible = true;
    }
    let click = this.cursor.getClick();
    if (click)
    {
        if (this.validAction(this.possibleMoves, {x: click.x, y: click.y}))               
        {
            if (!gm.bm.cursor.isCellOccupied())
            {
                this.x = click.x;
                this.y = click.y;
                this.moved = true;
                this.selectedAction.move = false;
            }
            else
            {
                this.selected = false;
                this.cursor.selected = undefined;
                this.selectedAction.move = false;
            }
        }
        else
        {
            this.selected = false;
            this.cursor.selected = undefined;
            this.selectedAction.move = false;
        }
        this.possibleMoves = [];
        gm.im.currentgroup.click = null;
    }
}

PlayerUnit.prototype.attackSelected = function () 
{
    if (gm.showUI)
    {
        this.possibleAttacks = this.calculateActionRadius({
            actionRange: this.attackRange,
            offset: 0
        });
        gm.closeBattleMenu();
        this.cursor.visible = true;
    }
    let click = this.cursor.getClick();
    if(click)
    {
        let point = {x: click.x, y: click.y};

        if(this.validAction(this.possibleAttacks, point))
        {
            let object = this.cursor.isCellOccupied();
            console.log(object)
            if(object && object.AIPackage)
            {
                this.cursor.target = object;
                this.selectedAction.attack = false;
            }
            else
            {
                this.selected = false;
                this.cursor.selected = undefined;
                this.selectedAction.attack = false;
            }
        }
        else
        {
            this.selected = false;
            this.cursor.selected = undefined;
            this.selectedAction.attack = false;
            gm.im.currentgroup.click = undefined;
        }
    }
}

PlayerUnit.prototype.playerPhase = function () {     
    if (this.selected)
    {
        if (this.selectedAction.move || this.selectedAction.attack)
        {
            if (!this.moved)
            {
                if (this.selectedAction.move)
                {
                    this.moveSelected();
                }
            }
            if (!this.attacked)
            {
                if (this.selectedAction.attack)
                {
                    this.attackSelected();
                }
            }
        }
        else if (!gm.showUI)
        {
            gm.openBattleMenu(520, 450);
            this.cursor.visible = false;
        }       
    }
    else if (!this.cursor.selected)
    {
        let click = this.cursor.getClick();
        if(click)
        {
            if (!this.attacked || !this.moved)
            {
                if (click.x === this.x && click.y === this.y)
                {
                    // console.log("your selected")
                    this.selected = true;
                    this.cursor.selected = this;
                    gm.im.currentgroup.click = null;
                }
            }
        }
    }
}

// PlayerUnit.prototype.playerPhaseOLD = function ()
// {
//     if (this.selected)
//     {
//        if (!gm.showUI)
//        {
//             gm.openBattleMenu(0, 0);
//        }
       
//        if(!this.moved)
//        {
//             this.possibleMoves = this.calculateActionRadius({
//                 actionRange: this.moveRange,
//                 offset: 0
//             });
//             if (gm.bm.cursor.getClick())
//             {
//                 if (this.validAction(this.possibleMoves, {x: this.cursor.x, y: this.cursor.y}))               
//                 {
//                     if (!gm.bm.cursor.isCellOccupied())
//                     {
//                         this.x = this.cursor.x;
//                         this.y = this.cursor.y;
//                         this.selected = true;
//                         this.cursor.selected = this;
//                         this.moved = true;
//                     }
//                     else
//                     {
//                         this.selected = false;
//                         this.cursor.selected = undefined;
//                     }
//                     gm.im.currentgroup.click = null;
//                 }
//                 else
//                 {
//                     this.selected = false;
//                     this.cursor.selected = undefined;
//                     gm.im.currentgroup.click = null;
//                 }
//             }
//         }
//         if (!this.attacked && this.moved)
//         {
//             this.possibleAttacks = this.calculateActionRadius({
//                     actionRange: this.attackRange,
//                     offset: 0
//             });
//             if(gm.bm.cursor.getClick())
//             {
//                 let point = {x: this.cursor.x, y: this.cursor.y};
                
//                 if(this.validAction(this.possibleAttacks, point))
//                 {
//                     let object = this.cursor.isCellOccupied();
                    
//                     if(object && object.health)
//                     {
//                         this.cursor.target = object;
//                     }
//                     else
//                     {
//                         this.selected = false;
//                         this.cursor.selected = undefined;
                        
//                     }
//                 }
//                 else
//                 {
//                     this.selected = false;
//                     this.cursor.selected = undefined;
//                     gm.im.currentgroup.click = undefined;
//                 }
//             }
//         }
//     }
//     else if(gm.bm.cursor.getClick())
//     {
//         //  console.log("we are on top")
//         if (!this.attacked || !this.moved)
//         {
//             if (this.cursor.getClick().x === this.x && this.cursor.getClick().y === this.y)
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


// PlayerUnit.prototype.draw = function (ctx) {
    
//     // console.log("help");
//     ctx.beginPath();
//     if (this.selected)
//     {
//         ctx.fillStyle = "rgba(0, 255, 0, 1)";
//         ctx.strokeStyle = "rgba(0, 0, 255, 1)";  
//     }
//     else
//     {
//         ctx.fillStyle = "rgba(0, 0, 255, 1)";
//         ctx.strokeStyle = "rgba(0, 0, 255, 1)";    
//     }     
//     ctx.arc(this.x * 64 + 32,this.y * 64 + 32, 32, 0, 2*Math.PI);
//     ctx.closePath();
//     ctx.fill();
// }


