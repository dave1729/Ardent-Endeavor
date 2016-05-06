var gm = gm || {};

//Input Manager takes the context to draw on
//and the name of your first InputGroup
//InputManager(context, String)
function InputManager(firstGroupName) {
	this.ctx = gm.ctx;
    this.inputgroup_list = [];
    this.currentgroup = new InputGroup(firstGroupName);
    this.inputgroup_list.push(this.currentgroup);
}

//Adds a new group and switches to it right stat now
//addGroup(String)
InputManager.prototype.addGroup = function(newGroupName) {
	this.currentgroup = new InputGroup(newGroupName);
	this.inputgroup_list.push(this.currentgroup);
}

//add a new input to the current group
//addInput(Input)
InputManager.prototype.addInput = function(theInput) {
	this.currentgroup.addInput(theInput);
}

//sets an input command to false(to stop a motion with a command)
//returns false if not in current group
//setFalse(String)
InputManager.prototype.setFalse = function(theName) {
	for(var i = 0; i < this.currentgroup.input_list.length; i++) {
		if(this.currentgroup.input_list[i].name === theName) {
			this.currentgroup.input_list[i].isPressed = false;
		}
	}
}

//sets all inputs in the current group to false(aka isPressed = false)
//setAllFalse()
InputManager.prototype.setAllFalse = function() {
	for(var i = 0; i < this.currentgroup.input_list.length; i++) {
		this.currentgroup.input_list[i].isPressed = false;
	}
}

//returns a boolean value used to check key presses
//checkInput(string)
InputManager.prototype.checkInput = function(theName) {
	var initiated = false;
	for(var i = 0; i < this.currentgroup.input_list.length; i++) {
		if(this.currentgroup.input_list[i].name === theName) {
			initiated = this.currentgroup.input_list[i].isPressed;
		}
	}
	return initiated;
}

//CANT REMEMBER WHY I MADE THIS, BUT ITS HERE IN CASE
//I REMEMEBER WHAT I WANTED IT FOR. :-)
// InputManager.prototype.inputCode = function(name) {
	// var code = 63;//default code is for the ? character
	// for(var i = 0; i < this.currentgroup.size; i++) {
		// if(this.currentgroup.inputname_list[i] === name) {
			// initiated = this.currentgroup.inputcharcode_list[i];
		// }
	// }
	// return initiated;
// }

//iterates forward through the groups, resets to beginning if you iterate
//past the last group. Default iterations is 1 iteration if given no input
//iterateGroupBy(int or nothing)
InputManager.prototype.iterateGroupBy = function(iterations = 1) {
	var currentGroupIndex;
	for(var i = 0; i < this.inputgroup_list.length; i++) {
		if(this.inputgroup_list[i].name === this.currentgroup.name) {
			currentGroupIndex = i;
		}
	}
	currentGroupIndex = ((currentGroupIndex + iterations) % this.inputgroup_list.length);
	this.currentgroup = this.inputgroup_list[currentGroupIndex];
}

//Changes the current group to the one with the passed name
//changeCurrentGroupTo(String)
InputManager.prototype.changeCurrentGroupTo = function(groupName) {
	var currentGroupIndex;
	for(var i = 0; i < this.inputgroup_list.length; i++) {
		if(this.inputgroup_list[i].name === groupName) {
			this.currentgroup = this.inputgroup_list[i];
			return;
		}
	}
}

//Sets Event Listeners to by used by the context passed on creation
//start()
InputManager.prototype.start = function (ctx) {
	var that = this;
	
    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

        if (x < 2048) {
            x = Math.floor(x / this.TILE_SIZE);
            y = Math.floor(y / this.TILE_SIZE);
        }
        return { x: x, y: y };
    }

    //event listeners are added here

    ctx.canvas.addEventListener("click", function (e) {
        that.click = getXandY(e);
    }, false);
    

    ctx.canvas.addEventListener("contextmenu", function (e) {
        that.rclick = getXandY(e);
        // console.log(e);
        // console.log("Right Click Event - X,Y " + e.clientX + ", " + e.clientY);
        e.preventDefault();
    }, false);

    ctx.canvas.addEventListener("mousemove", function (e) {
        //console.log(e);
        that.mouse = getXandY(e);
    }, false);

    ctx.canvas.addEventListener("mousewheel", function (e) {
        //console.log(e);
        that.wheel = e;
        //console.log("Click Event - X,Y " + e.clientX + ", " + e.clientY + " Delta " + e.deltaY);
    }, false);
    
    ctx.canvas.addEventListener("keydown", function (e) {
		for(var i = 0; i < that.currentgroup.input_list.length; i++) {
			if(that.currentgroup.input_list[i].charCode === e.which) {
				that.currentgroup.input_list[i].isPressed = true;
			}
		}
    }, false);

    // this.ctx.canvas.addEventListener("keypress", function (e) {
        // that.chars[e.code] = true;
        // console.log(e);
        // console.log("Key Pressed Event - Char " + e.charCode + " Code " + e.keyCode);
    // }, false);
// 
    ctx.canvas.addEventListener("keyup", function (e) {
		for(var i = 0; i < that.currentgroup.input_list.length; i++) {
			if(that.currentgroup.input_list[i].charCode === e.which) {
				that.currentgroup.input_list[i].isPressed = false;
			}
		}
    }, false);

    console.log('Input started');
}

//Input Group, holds just  name and list of Inputs
//InputGroup(String)
function InputGroup(theName) {
	this.name = theName;
    this.input_list = [];
}

//adds a new input to the input group
//addInput(Input)
InputGroup.prototype.addInput = function(theInput) {
	this.input_list.push(theInput);
}

//Sends an alert that shows the current group
InputGroup.prototype.printGroupAsAlert = function() {
	for(var i = 0; i < this.input_list.length; i++) {
		alert(this.input_list[i].name + " " + this.input_list[i].charCode + " " + this.input_list[i].isPressed);
	}
}

//Input is a name a character and isPressed defaults to false
//Input(string, char)
function Input(theName, theChar) {
    this.name = theName;
    this.charCode = theChar.charCodeAt(0) - 32;
    this.isPressed = false;
}