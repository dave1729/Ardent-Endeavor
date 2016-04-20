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
}

Cursor.prototype.update = function () {
    if (this.game.b)
    {
        this.visible = true;
    }
}

Cursor.prototype.draw = function () {
    if (this.visible)
    {
        console.log(this.game.mouse);
        // this.game.mouse
    }
}