window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

const TILE_SIZE = 64;

function GameEngine() {
    this.entities = [];
    this.controlEntity = null;
    this.backgroundEntity = null;
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    
    this.am = null; // AssetManager
    
    this.mm = null; // MapManager
    this.em = null; // EntityManager
    this.sm = null; // SceneManager
}

GameEngine.prototype.init = function (ctx, AM, game) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    this.disableInput = false;
    this.startInput();
    
    this.am = AM;
    this.mm = new MapManager(game);
    this.em = new EntityManager(game);
    this.sm = new SceneManager(game);
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');

    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

        //not sure what this 1024 or 32 does...
        //
        // DAVID
        // This converts the canvas into 64 x 64 tiles
        //
        // if (x < 1024) {
            x = Math.floor(x / this.TILE_SIZE);
            y = Math.floor(y / this.TILE_SIZE);
        // }
        return { x: x, y: y };
    }

    var that = this;

    // event listeners are added here

    this.ctx.canvas.addEventListener("click", function (e) {
        if(that.b)
            that.click = getXandY(e);
        //console.log("Left Click Event - X,Y " + e.clientX + ", " + e.clientY);
    }, false);

    this.ctx.canvas.addEventListener("contextmenu", function (e) {
        if(that.b)
            that.rclick = getXandY(e);
        //console.log(e);
        //console.log("Right Click Event - X,Y " + e.clientX + ", " + e.clientY);
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("mousemove", function (e) {
        //console.log(e);
        that.mouse = getXandY(e);
    }, false);

    this.ctx.canvas.addEventListener("mousewheel", function (e) {
        //console.log(e);
        that.wheel = e;
        //console.log("Click Event - X,Y " + e.clientX + ", " + e.clientY + " Delta " + e.deltaY);
    }, false);
    
    this.ctx.canvas.addEventListener("keydown", function (e) {
        // console.log(e);
        // console.log("Key Down Event - Char " + e.code + " Code " + e.keyCode);
        if (!that.disableInput)
        {
            if(e.which === 87) {
                that.controlEntity.w = true;
            }
            else if(e.which === 83) {
                that.controlEntity.s = true;
            }
            else if(e.which === 65) {
                that.controlEntity.a = true;
            }	
            else if(e.which === 68) {
                that.controlEntity.d = true;
            }
        }
        if (e.which === 66)
        {
            that.removeEntity(1);
            that.b = true;
            // that.entities = [];
        }
        
    }, false);

    this.ctx.canvas.addEventListener("keypress", function (e) {
        that.chars[e.code] = true;
        //console.log(e);
        //console.log("Key Pressed Event - Char " + e.charCode + " Code " + e.keyCode);
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        // console.log(e);
        // console.log("Key Up Event - Char " + e.code + " Code " + e.keyCode);
        if (!that.disableInput)
        {
            if(e.which === 87) {
                that.controlEntity.w = false;
            }
            else if(e.which === 83) {

                that.controlEntity.s = false;
            }
            else if(e.which === 65) {
                that.controlEntity.a = false;
            }	
            else if(e.which === 68) {
                that.controlEntity.d = false;
            }	
            
            if(!(that.w || that.s || that.a || that.d)) {
                that.controlEntity.speedX = 0;
                that.controlEntity.speedY = 0;
            }
        }     
    }, false);

    console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
    if(entity.entityID === 1) this.controlEntity = entity;
    if(entity.entityID === 0) this.backgroundEntity = entity;
    //Sort entities by layer
    this.entities.sort(
    		function(x, y)
            {
            	return x.layer - y.layer;
            }
    );
}

GameEngine.prototype.removeEntity = function (id) {
    this.entities.forEach((entity) => {
        if(entity.entityID === id)
        {
            entity.removeFromWorld = true;
        }
    })
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    
    for (var i = 0; i < this.entities.length; i++) {
    	this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }
    this.click = undefined;
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    //console.log(this.haltLoop);
    //if (!this.haltLoop) {
    	this.update();
        this.draw();
    //}
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}