/**
 * 
 */

function UIManager() {
	this.ctx = gm.ctxUI;
	this.screenWidth = this.ctx.canvas.width;
	this.screenHeight = this.ctx.canvas.height;
	this.gameMenu = new GameMenu(this, this.ctx, 10, 10);
	
	document.getElementById("uiLayer").style.zIndex = "-1";
}
UIManager.prototype.update = function() {
	this.gameMenu.update();
}
UIManager.prototype.draw = function() {
	this.gameMenu.draw();
}


/* +------------------------------------------+ */
/* |      ===  Menu Backgrounds  ===          | */
/* +------------------------------------------+ */
function GameMenu(uimanager, ctx, x, y) {
	this.ui = uimanager;
	this.BUTTON_HEIGHT = this.ui.screenHeight / 16;
	this.MENU_WIDTH = this.ui.screenWidth / 4;
	
	this.x = x;
	this.y = y;
	this.ctx = ctx;
	this.buttons = [];
	this.buttons.push(new Button(this, this.ctx, "Items", this.x, this.y + (this.BUTTON_HEIGHT*0), this.MENU_WIDTH, this.BUTTON_HEIGHT));
	this.buttons.push(new Button(this, this.ctx, "Magic", this.x, this.y + (this.BUTTON_HEIGHT*1), this.MENU_WIDTH, this.BUTTON_HEIGHT));
	this.buttons.push(new Button(this, this.ctx, "Equipment", this.x, this.y + (this.BUTTON_HEIGHT*2), this.MENU_WIDTH, this.BUTTON_HEIGHT));
	this.buttons.push(new Button(this, this.ctx, "Status", this.x, this.y + (this.BUTTON_HEIGHT*3), this.MENU_WIDTH, this.BUTTON_HEIGHT));
	this.buttons.push(new Button(this, this.ctx, "Options", this.x, this.y + (this.BUTTON_HEIGHT*4), this.MENU_WIDTH, this.BUTTON_HEIGHT));
	this.buttons.push(new Button(this, this.ctx, "Save", this.x, this.y + (this.BUTTON_HEIGHT*5), this.MENU_WIDTH, this.BUTTON_HEIGHT));
}
GameMenu.prototype.update = function () {
	// Update buttons
	var i;
	for (i = 0; i < this.buttons.length; i++) {
		this.buttons[i].update(this.ctx);
	}
}
GameMenu.prototype.draw = function () {
	// Draw the backdrop and border
	this.ctx.strokeStyle = "rgb(255, 255, 255)";
	this.ctx.fillStyle = "rgba(0, 98, 130, 0.01)";
	roundRect(this.ctx, this.x, this.y, this.MENU_WIDTH, (this.BUTTON_HEIGHT * this.buttons.length), 15, true, true);
			
	// Draw buttons
	var i;
	for (i = 0; i < this.buttons.length; i++) {
		this.buttons[i].draw(this.ctx);
	}
}









//var UIObject = {
//    intersects: function(obj, mouse) {
//        var t = 5; //tolerance
//        var xIntersect = (mouse.x + t) /> obj.x && (mouse.x - t)  obj.y && (mouse.y - t) < obj.y + obj.height;
//        return  xIntersect &amp;&amp; yIntersect;
//    },
//    updateStats: function(canvas){
//        if (this.intersects(this, canvas.mouse)) {
//            this.hovered = true;
//            if (canvas.mouse.clicked) {
//                this.clicked = true;
//            }
//        } else {
//            this.hovered = false;
//        }
// 
//        if (!canvas.mouse.down) {
//            this.clicked = false;
//        }               
//    }
//};

/* +------------------------------------------+ */
/* |            ===  Button  ===              | */
/* +------------------------------------------+ */

function Button(parent, ctx, text, x, y, width, height) {
	this.parent = parent;
	this.ctx = ctx;
	this.text = text;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.clicked = false;
	this.hovered = false;
}
//Button.prototype = _.extend(Button.prototype, UIObject);

Button.prototype.update = function(canvas) {
	var wasNotClicked = !this.clicked;
    //this.updateStats(canvas);
 
    if (this.clicked && wasNotClicked) {
        if (!_.isUndefined(this.handler)) {
            this.handler();
        }
    }
}

Button.prototype.draw = function(ctx) {
	// Button color
	if (this.hovered) {
		ctx.fillStyle = "rgba(255,165,0,0.8)";
	} else {
		ctx.fillStyle = "rgba(255,165,0,0)";
	}
	
	// Draw button frame
	ctx.fillRect(this.x, this.y, this.width, this.height);
	
	// Font options
	var fontSize = 20;
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font = fontSize + "px sans-serif";
	
	// Text position
	var textSize = ctx.measureText(this.text);
	var textX = this.x + (this.width/2) - (textSize.width/2);
	var textY = this.y + (this.height) - (fontSize/2);
	
	// Draw text
	ctx.fillText(this.text, textX, textY);
}








function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
	  if (typeof stroke == 'undefined') {
	    stroke = true;
	  }
	  if (typeof radius === 'undefined') {
	    radius = 5;
	  }
	  if (typeof radius === 'number') {
	    radius = {tl: radius, tr: radius, br: radius, bl: radius};
	  } else {
	    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
	    for (var side in defaultRadius) {
	      radius[side] = radius[side] || defaultRadius[side];
	    }
	  }
	  ctx.beginPath();
	  ctx.moveTo(x + radius.tl, y);
	  ctx.lineTo(x + width - radius.tr, y);
	  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	  ctx.lineTo(x + width, y + height - radius.br);
	  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	  ctx.lineTo(x + radius.bl, y + height);
	  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	  ctx.lineTo(x, y + radius.tl);
	  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	  ctx.closePath();
	  if (fill) {
	    ctx.fill();
	  }
	  if (stroke) {
	    ctx.stroke();
	  }

	}