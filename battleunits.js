function Unit(spec)
{
    this.cursor = gm.bm.cursor;
    this.health = spec.health;
    this.maxhealth = spec.health;
    this.selected = false;
    this.damage = spec.damage;
    this.moved = false;
    this.attacked = false;
    this.attackRange = 1;
    this.moveRange = 3;
    this.possibleMoves = [];
    // Used for animating during battle;
    this.xOffset = 0;
    this.yOffset = 0;
    
    Entity.call(this, spec.x, spec.y);
}

Unit.prototype = Object.create(Entity.prototype);
Unit.prototype.constructor = Unit;

Unit.prototype.draw = function (ctx) {
	this.drawHealthBar(ctx);
    //this.animation.drawEntity(gm.clockTick, ctx, this.x * TILE_SIZE, this.y * TILE_SIZE);
}
Unit.prototype.drawHealthBar = function (ctx) {
	gm.ctx.fillStyle = "rgb(184, 0, 72)";
	gm.ctx.lineWidth = 1;
	gm.ctx.fillRect(this.x * TILE_SIZE + 5, this.y * TILE_SIZE + (TILE_SIZE-9), TILE_SIZE-10, 8);
	
	gm.ctx.fillStyle = "rgb(0, 222, 0)";
	var healthBarWidth = (TILE_SIZE-10)*(this.health/this.maxhealth);
	gm.ctx.fillRect(this.x * TILE_SIZE + 5, this.y * TILE_SIZE + (TILE_SIZE-9), healthBarWidth, 8);
	
	gm.ctx.strokeStyle = "rgb(0, 0, 0)";
	gm.ctx.strokeRect(this.x * TILE_SIZE + 5, this.y * TILE_SIZE + (TILE_SIZE-9), TILE_SIZE-10, 8);
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

Unit.prototype.playerPhase = function ()
{
    if (!this.cursor.selected)
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
    this.overworld = spec.overworld;
    this.animation = spec.overworld.animation;
    Unit.call(this, spec);
}

EnemyUnit.prototype = Object.create(Unit.prototype);
EnemyUnit.prototype.constructor = EnemyUnit;

EnemyUnit.prototype.draw = function (ctx) {
    if (this.selected)
    {   
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 255, 0, 1)";
        ctx.strokeStyle = "rgba(0, 0, 255, 1)"; 
        ctx.arc(this.x * TILE_SIZE + 32,this.y * TILE_SIZE + 32, 32, 0, 2*Math.PI);
        ctx.closePath();
        ctx.fill();
    }
    	var location = {x: this.x * TILE_SIZE,
					y: this.y * TILE_SIZE,
					xOffset: this.xOffset,
					yOffset: this.yOffset };
	this.overworld.draw(ctx, location);
    Unit.prototype.draw.call(this, ctx);
}

EnemyUnit.prototype.playerPhase = function () {
    if(this.selected)
    {
        this.possibleMoves = this.calculateActionRadius({
            actionRange: this.moveRange,
            offset: 0
        });
        if (!gm.showUI)
        {
        	gm.openStatusBox("Enemy", this.health, this.maxhealth);
        }
        let click = this.cursor.getClick();
        if(click)
        {
            console.log("here")
            this.selected = false;
            this.cursor.selected = undefined;
            gm.im.currentgroup.click = null;
            gm.closeStatusBox();
        }     
    }
    Unit.prototype.playerPhase.call(this);
}

function PlayerUnit(spec)
{
    //function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale, row) {
    this.animation = new Animation(spec.spriteSheet, 64, 64, 4, 0.2, 12, true, 1);
    this.selectedAction = {move: false, attack: false}
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
        ctx.arc(this.x * TILE_SIZE + 32, this.y * TILE_SIZE + 32, 32, 0, 2*Math.PI);
        ctx.closePath();
        ctx.fill();
    }
    this.animation.drawEntity(gm.clockTick, ctx, this.x * TILE_SIZE, this.y * TILE_SIZE);
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
        	gm.ui.statusBox.newInfo("Player", this.health, this.maxhealth);
            gm.openBattleMenu(520, 450);
            this.cursor.visible = false;
        }       
    }
    Unit.prototype.playerPhase.call(this);
}