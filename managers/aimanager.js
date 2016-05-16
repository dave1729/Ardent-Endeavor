/* +------------------------------------------+ */
/* |           ===  AI MANAGER  ===           | */
/* +------------------------------------------+ */
/**
 * The AI Manager handles enemy path finding and tactics.
 * Uses A* greedy algorithm for path finding. Enemy tactical
 * logic will vary depending on the AI Package it uses.
 */
function AIManager() {
	this.pathFinder = new EasyStar.js();
	this.pathFinder.disableDiagonals();
	this.pathFinder.setAcceptableTiles([0]);
	
	this.tileMap = [[0,0,0],
	                [0,0,0],
	                [0,0,0]];
	
	this.playerList = [];
	this.enemyList = [];
	
	// Contains the AI packages available for enemies.
	this.AIPackages = new AIPackages();
}

/**
 * Generates a new tile map for the battle scene based on battle entity
 * locations.
 * 
 * @param {Number} gridWidth: The tile width of the battle scene.
 * @param {Number} gridHeight: The tile height of the battle scene.
 * @param {Array}  players: The list of player objects.
 * @param {Array}  enemies: The list of enemy objects.
 * @param {Array}  collidableTiles: The list of collidable tiles' coordinates.
 */
AIManager.prototype.newBattle = function (gridWidth, gridHeight, players, enemies, collidableTiles) {
	this.playerList = players;
	this.enemyList = enemies;
	
	// Generate blank map with 0's (blank terrain).
	this.tileMap.length = 0;
	var blankRow = [];
	for (var row = 0; row < gridWidth; row++) {
		this.blankRow.push(0);
	}
	for (var col = 0; col < gridHeight; col++) {
		this.tileMap.push(blankRow);
	}
	
	// Insert battle entities into map.
	for (var p = 0; p < this.playerList.length; p++) {
		this.tileMap[playerList[p].y][playerList[p].x] = 1;
		this.playerList[p].startX = this.playerList[p].x;
		this.playerList[p].startY = this.playerList[p].y;
	}
	for (var e = 0; e < this.enemyList.length; e++) {
		this.tileMap[enemyList[e].y][enemyList[e].x] = 2;
	}
	for (var c = 0; c < this.collidableTiles.length; c++) {
		this.tileMap[collidableTiles[c].y][collidableTiles[c].x] = 3;
	}
}

/**
 * Updates the locations of the players on the grid battle map.
 * (Call this after every player has done their turn and before
 * enemies start their round.)
 */
AIManager.prototype.updatePlayerPositions = function () {
	
	for (var p = 0; p < this.playerList.length; p++) {
		this.tileMap[playerList[p].startY][playerList[p].startX] = 0;
		this.tileMap[playerList[p].y][playerList[p].x] = 1;
		this.playerList[p].startX = this.playerList[p].x;
		this.playerList[p].startY = this.playerList[p].y;
	}
}

/**
 * Will generate the moves for each enemy in the current battle.
 * 
 * @return {List} List of Move objects.
 */
AIManager.prototype.runEnemyPhase = function () {
	this.updatePlayerPositions();
	this.pathFinder.setGrid(this.tileMap);
	var moveList = [];
	
	// For each enemy, generate a move, update the grid, then add to the move list.
	for (var e = 0; e < this.enemyList.length; e++) {
		var move = this.getEnemyMove(enemyList[e])
		this.tileMap[enemyList[e].y][enemyList[e].x] = 0;
		this.tileMap[move.path[path.length-1].y][move.path[path.length-1].y] = 2;
		moveList.push(move);
	}
	return moveList;
}

/**
 * An enemy should have an AI Package stored in the variable runAIPackage.
 * 
 * @param {object} enemy: The enemy being processed.
 */
AIManager.prototype.getEnemyMove = function (enemy) {
	return enemy.runAIPackage(this, enemy);
}


/* +------------------------------------------+ */
/* |          ===  AI PACKAGES  ===           | */
/* +------------------------------------------+ */
/**
 * An AI Package will determine where the enemy will move, who they will
 * attack and what they will do. Each AI Package determines the specific
 * behavior of the enemy.
 */
function AIPackages() {
	/*
	 * Berserker AI will take the shortest path to the
	 * closest player and attack them if they are in range.
	 */
	this.Berserker = function (AIManager, enemy) {
		var pathList = [];
		
		// Find the shortest path to each player.
		for (var i = 0; i < AIManager.playerList.length; i++) {
			var pc = AIManager.playerList[i];
			AIManager.pathFinder.findPath(enemy.x, enemy.y, pc.x, pc.y, onPathFound);
			AIManager.pathFinder.calculate();
			
			function onPathFound(path) {
				pathList.push(path);
			}
		}
		
		// Find the closest player.
		var min = -1;
		if (pathList[0] != null) {
			min = 0;
		}
		for (var j = 1; j < pathList.length; j++) {
			if (pathList[j] != null && pathList[j].length < pathList[min].length) {
				min = j;
			}
		}
		if (min === -1) {
			console.error("No paths were found");
			return null;
		}
		
		// Figure out how far along the path the enemy can go.
		var thePath = pathList[min];
		var distanceAway = 0;
		var isAttacking = false;
		
		if (thePath.length - 2 <= enemy.speed) {
			thePath.splice(thePath.length - 1, 1);
		} else {
			distanceAway = thePath.length - enemy.speed + 1;
			thePath.splice(enemy.speed + 2, distanceAway);
		}
		
		// Is the target within range of the monster?
		if (distanceAway <= enemy.range) {
			isAttacking = true;
		}
		return new Move(enemy, thePath, isAttacking, AIManager.playerList[min]);
	} /* END OF BERSERKER */
}

/* +------------------------------------------+ */
/* |              ===  MOVE ===               | */
/* +------------------------------------------+ */
/**
 * A Move object contains all the data needed to process a move.
 * 
 * @param {object} enemy: The enemy being processed.
 * @param {list}   path: list of coordinates that indicate the path the enemy will take.
 * 					  path[0].x and path[0].y is the monster starting location.
 * 					  path[path.length-1].x and path[path.length-1] is the ending location.
 * @param {bool}   isAttacking: Indicates if the enemy will perform an attack on their move.
 * @param {target} target: The player that is the intended target of the player. Null if none.
 */
function Move(enemy, path, isAttacking, target) {
	this.enemy = enemy;
	this.path = path;
	this.isAttacking = isAttacking;
	this.target = target;
}

/*********************************************************************/

/* +------------------------------------------+ */
/* |       ===  EasyStart.js (A*)  ===        | */
/* |         Author: prettymuchbryce		  | */
/* +------------------------------------------+ */
// NameSpace
var EasyStar = EasyStar || {};

// For require.js
if (typeof define === "function" && define.amd) {
	define("easystar", [], function() {
		return EasyStar;
	});
}

// For browserify and node.js
if (typeof module !== 'undefined' && module.exports) {
	module.exports = EasyStar;
}
/**
* A simple Node that represents a single tile on the grid.
* @param {Object} parent The parent node.
* @param {Number} x The x position on the grid.
* @param {Number} y The y position on the grid.
* @param {Number} costSoFar How far this node is in moves*cost from the start.
* @param {Number} simpleDistanceToTarget Manhatten distance to the end point.
**/
EasyStar.Node = function(parent, x, y, costSoFar, simpleDistanceToTarget) {
	this.parent = parent;
	this.x = x;
	this.y = y;
	this.costSoFar = costSoFar;
	this.simpleDistanceToTarget = simpleDistanceToTarget;

	/**
	* @return {Number} Best guess distance of a cost using this node.
	**/
	this.bestGuessDistance = function() {
		return this.costSoFar + this.simpleDistanceToTarget;
	}
};

// Constants
EasyStar.Node.OPEN_LIST = 0;
EasyStar.Node.CLOSED_LIST = 1;
/**
* This is an improved Priority Queue data type implementation that can be used to sort any object type.
* It uses a technique called a binary heap.
* 
* For more on binary heaps see: http://en.wikipedia.org/wiki/Binary_heap
* 
* @param {String} criteria The criteria by which to sort the objects. 
* This should be a property of the objects you're sorting.
* 
* @param {Number} heapType either PriorityQueue.MAX_HEAP or PriorityQueue.MIN_HEAP.
**/
EasyStar.PriorityQueue = function(criteria,heapType) {
	this.length = 0; //The current length of heap.
	var queue = [];
	var isMax = false;

	//Constructor
	if (heapType==EasyStar.PriorityQueue.MAX_HEAP) {
		isMax = true;
	} else if (heapType==EasyStar.PriorityQueue.MIN_HEAP) {
		isMax = false;
	} else {
		throw heapType + " not supported.";
	}

	/**
	* Inserts the value into the heap and sorts it.
	* 
	* @param value The object to insert into the heap.
	**/
	this.insert = function(value) {
		if (!value.hasOwnProperty(criteria)) {
			throw "Cannot insert " + value + " because it does not have a property by the name of " + criteria + ".";
		}
		queue.push(value);
		this.length++;
		bubbleUp(this.length-1);
	}

	/**
	* Peeks at the highest priority element.
	*
	* @return the highest priority element
	**/
	this.getHighestPriorityElement = function() {
		return queue[0];
	}

	/**
	* Removes and returns the highest priority element from the queue.
	*
	* @return the highest priority element
	**/
	this.shiftHighestPriorityElement = function() {
		if (this.length === 0) {
			throw ("There are no more elements in your priority queue.");
		} else if (this.length === 1) {
			var onlyValue = queue[0];
			queue = [];
                        this.length = 0;
			return onlyValue;
		}
		var oldRoot = queue[0];
		var newRoot = queue.pop();
		this.length--;
		queue[0] = newRoot;
		swapUntilQueueIsCorrect(0);
		return oldRoot;
	}

	var bubbleUp = function(index) {
		if (index===0) {
			return;
		}
		var parent = getParentOf(index);
		if (evaluate(index,parent)) {
			swap(index,parent);
			bubbleUp(parent);
		} else {
			return;
		}
	}

	var swapUntilQueueIsCorrect = function(value) {
		var left = getLeftOf(value);
		var right = getRightOf(value);
		if (evaluate(left,value)) {
			swap(value,left);
			swapUntilQueueIsCorrect(left);
		} else if (evaluate(right,value)) {
			swap(value,right);
			swapUntilQueueIsCorrect(right);
		} else if (value==0) {
			return;
		} else {
			swapUntilQueueIsCorrect(0);
		}
	}

	var swap = function(self,target) {
		var placeHolder = queue[self];
		queue[self] = queue[target];
		queue[target] = placeHolder;
	}

	var evaluate = function(self,target) {
		if (queue[target]===undefined||queue[self]===undefined) {
			return false;
		}
		
		var selfValue;
		var targetValue;
		
		// Check if the criteria should be the result of a function call.
		if (typeof queue[self][criteria] === 'function') {
			selfValue = queue[self][criteria]();
			targetValue = queue[target][criteria]();
		} else {
			selfValue = queue[self][criteria];
			targetValue = queue[target][criteria];
		}

		if (isMax) {
			if (selfValue > targetValue) {
				return true;
			} else {
				return false;
			}
		} else {
			if (selfValue < targetValue) {
				return true;
			} else {
				return false;
			}
		}
	}

	var getParentOf = function(index) {
		return Math.floor((index-1) / 2);
	}

	var getLeftOf = function(index) {
		return index*2 + 1;
	}

	var getRightOf = function(index) {
		return index*2 + 2;
	}
};

// Constants
EasyStar.PriorityQueue.MAX_HEAP = 0;
EasyStar.PriorityQueue.MIN_HEAP = 1;

/**
 * Represents a single instance of EasyStar.
 * A path that is in the queue to eventually be found.
 */
EasyStar.instance = function() {
	this.isDoneCalculating = true;
	this.pointsToAvoid = {};
	this.startX;
	this.callback;
	this.startY;
	this.endX;
	this.endY;
	this.nodeHash = {};
	this.openList;
};
/**
*	EasyStar.js
*	github.com/prettymuchbryce/EasyStarJS
*	Licensed under the MIT license.
* 
*	Implementation By Bryce Neal (@prettymuchbryce)
**/
EasyStar.js = function() {
	var STRAIGHT_COST = 1.0;
	var DIAGONAL_COST = 1.4;
	var syncEnabled = false;
	var pointsToAvoid = {};
	var collisionGrid;
	var costMap = {};
	var pointsToCost = {};
	var allowCornerCutting = true;
	var iterationsSoFar;
	var instances = [];
	var iterationsPerCalculation = Number.MAX_VALUE;
	var acceptableTiles;
	var diagonalsEnabled = false;

	/**
	* Sets the collision grid that EasyStar uses.
	* 
	* @param {Array|Number} tiles An array of numbers that represent 
	* which tiles in your grid should be considered
	* acceptable, or "walkable".
	**/
	this.setAcceptableTiles = function(tiles) {
		if (tiles instanceof Array) {
			// Array
			acceptableTiles = tiles;
		} else if (!isNaN(parseFloat(tiles)) && isFinite(tiles)) {
			// Number
			acceptableTiles = [tiles];
		}
	};

	/**
	* Enables sync mode for this EasyStar instance..
	* if you're into that sort of thing.
	**/
	this.enableSync = function() {
		syncEnabled = true;
	};

	/**
	* Disables sync mode for this EasyStar instance.
	**/
	this.disableSync = function() {
		syncEnabled = false;
	};

	/**
	 * Enable diagonal pathfinding.
	 */
	this.enableDiagonals = function() {
		diagonalsEnabled = true;
	}

	/**
	 * Disable diagonal pathfinding.
	 */
	this.disableDiagonals = function() {
		diagonalsEnabled = false;
	}

	/**
	* Sets the collision grid that EasyStar uses.
	* 
	* @param {Array} grid The collision grid that this EasyStar instance will read from. 
	* This should be a 2D Array of Numbers.
	**/
	this.setGrid = function(grid) {
		collisionGrid = grid;

		//Setup cost map
		for (var y = 0; y < collisionGrid.length; y++) {
			for (var x = 0; x < collisionGrid[0].length; x++) {
				if (!costMap[collisionGrid[y][x]]) {
					costMap[collisionGrid[y][x]] = 1
				}
			}
		}
	};

	/**
	* Sets the tile cost for a particular tile type.
	*
	* @param {Number} The tile type to set the cost for.
	* @param {Number} The multiplicative cost associated with the given tile.
	**/
	this.setTileCost = function(tileType, cost) {
		costMap[tileType] = cost;
	};

	/**
	* Sets the an additional cost for a particular point.
	* Overrides the cost from setTileCost.
	*
	* @param {Number} x The x value of the point to cost.
	* @param {Number} y The y value of the point to cost.
	* @param {Number} The multiplicative cost associated with the given point.
	**/
	this.setAdditionalPointCost = function(x, y, cost) {
		pointsToCost[x + '_' + y] = cost;
	};

	/**
	* Remove the additional cost for a particular point.
	*
	* @param {Number} x The x value of the point to stop costing.
	* @param {Number} y The y value of the point to stop costing.
	**/
	this.removeAdditionalPointCost = function(x, y) {
		delete pointsToCost[x + '_' + y];
	}

	/**
	* Remove all additional point costs.
	**/
	this.removeAllAdditionalPointCosts = function() {
		pointsToCost = {};
	}

	/**
	* Sets the number of search iterations per calculation. 
	* A lower number provides a slower result, but more practical if you 
	* have a large tile-map and don't want to block your thread while
	* finding a path.
	* 
	* @param {Number} iterations The number of searches to prefrom per calculate() call.
	**/
	this.setIterationsPerCalculation = function(iterations) {
		iterationsPerCalculation = iterations;
	};
	
	/**
	* Avoid a particular point on the grid, 
	* regardless of whether or not it is an acceptable tile.
	*
	* @param {Number} x The x value of the point to avoid.
	* @param {Number} y The y value of the point to avoid.
	**/
	this.avoidAdditionalPoint = function(x, y) {
		pointsToAvoid[x + "_" + y] = 1;
	};

	/**
	* Stop avoiding a particular point on the grid.
	*
	* @param {Number} x The x value of the point to stop avoiding.
	* @param {Number} y The y value of the point to stop avoiding.
	**/
	this.stopAvoidingAdditionalPoint = function(x, y) {
		delete pointsToAvoid[x + "_" + y];
	};

	/**
	* Enables corner cutting in diagonal movement.
	**/
	this.enableCornerCutting = function() {
		allowCornerCutting = true;
	};

	/**
	* Disables corner cutting in diagonal movement.
	**/
	this.disableCornerCutting = function() {
		allowCornerCutting = false;
	};

	/**
	* Stop avoiding all additional points on the grid.
	**/
	this.stopAvoidingAllAdditionalPoints = function() {
		pointsToAvoid = {};
	};

	/**
	* Find a path.
	* 
	* @param {Number} startX The X position of the starting point.
	* @param {Number} startY The Y position of the starting point.
	* @param {Number} endX The X position of the ending point.
	* @param {Number} endY The Y position of the ending point.
	* @param {Function} callback A function that is called when your path
	* is found, or no path is found.
	* 
	**/
	this.findPath = function(startX, startY, endX, endY, callback) {
		// Wraps the callback for sync vs async logic
		var callbackWrapper = function(result) {
			if (syncEnabled) {
				callback(result);
			} else {
				setTimeout(function() {
					callback(result);
				});
			}
		}

		// No acceptable tiles were set
		if (acceptableTiles === undefined) {
			throw new Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");
		}
		// No grid was set
		if (collisionGrid === undefined) {
			throw new Error("You can't set a path without first calling setGrid() on EasyStar.");
		}

		// Start or endpoint outside of scope.
		if (startX < 0 || startY < 0 || endX < 0 || endX < 0 || 
		startX > collisionGrid[0].length-1 || startY > collisionGrid.length-1 || 
		endX > collisionGrid[0].length-1 || endY > collisionGrid.length-1) {
			throw new Error("Your start or end point is outside the scope of your grid.");
		}

		// Start and end are the same tile.
		if (startX===endX && startY===endY) {
			callbackWrapper([]);
			return;
		}

		// End point is not an acceptable tile.
		var endTile = collisionGrid[endY][endX];
		var isAcceptable = false;
		for (var i = 0; i < acceptableTiles.length; i++) {
			if (endTile === acceptableTiles[i]) {
				isAcceptable = true;
				break;
			}
		}

		if (isAcceptable === false) {
			callbackWrapper(null);
			return;
		}

		// Create the instance
		var instance = new EasyStar.instance();
		instance.openList = new EasyStar.PriorityQueue("bestGuessDistance",EasyStar.PriorityQueue.MIN_HEAP);
		instance.isDoneCalculating = false;
		instance.nodeHash = {};
		instance.startX = startX;
		instance.startY = startY;
		instance.endX = endX;
		instance.endY = endY;
		instance.callback = callbackWrapper;

		instance.openList.insert(coordinateToNode(instance, instance.startX, 
			instance.startY, null, STRAIGHT_COST));

		instances.push(instance);
	};

	/**
	* This method steps through the A* Algorithm in an attempt to
	* find your path(s). It will search 4-8 tiles (depending on diagonals) for every calculation.
	* You can change the number of calculations done in a call by using
	* easystar.setIteratonsPerCalculation().
	**/
	this.calculate = function() {
		if (instances.length === 0 || collisionGrid === undefined || acceptableTiles === undefined) {
			return;
		}
		for (iterationsSoFar = 0; iterationsSoFar < iterationsPerCalculation; iterationsSoFar++) {
			if (instances.length === 0) {
				return;
			}

			if (syncEnabled) {
				// If this is a sync instance, we want to make sure that it calculates synchronously. 
				iterationsSoFar = 0;
			}

			// Couldn't find a path.
			if (instances[0].openList.length === 0) {
				var ic = instances[0];
				ic.callback(null);
				instances.shift();
				continue;
			}

			var searchNode = instances[0].openList.shiftHighestPriorityElement();

			var tilesToSearch = [];
			searchNode.list = EasyStar.Node.CLOSED_LIST;

			if (searchNode.y > 0) {
				tilesToSearch.push({ instance: instances[0], searchNode: searchNode, 
					x: 0, y: -1, cost: STRAIGHT_COST * getTileCost(searchNode.x, searchNode.y-1)});
			}
			if (searchNode.x < collisionGrid[0].length-1) {
				tilesToSearch.push({ instance: instances[0], searchNode: searchNode, 
					x: 1, y: 0, cost: STRAIGHT_COST * getTileCost(searchNode.x+1, searchNode.y)});
			}
			if (searchNode.y < collisionGrid.length-1) {
				tilesToSearch.push({ instance: instances[0], searchNode: searchNode, 
					x: 0, y: 1, cost: STRAIGHT_COST * getTileCost(searchNode.x, searchNode.y+1)});
			}
			if (searchNode.x > 0) {
				tilesToSearch.push({ instance: instances[0], searchNode: searchNode, 
					x: -1, y: 0, cost: STRAIGHT_COST * getTileCost(searchNode.x-1, searchNode.y)});
			}
			if (diagonalsEnabled) {
				if (searchNode.x > 0 && searchNode.y > 0) {

					if (allowCornerCutting ||
						(isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y-1) &&
						isTileWalkable(collisionGrid, acceptableTiles, searchNode.x-1, searchNode.y))) {
						
						tilesToSearch.push({ instance: instances[0], searchNode: searchNode, 
							x: -1, y: -1, cost: DIAGONAL_COST * getTileCost(searchNode.x-1, searchNode.y-1)});
					}
				}
				if (searchNode.x < collisionGrid[0].length-1 && searchNode.y < collisionGrid.length-1) {

					if (allowCornerCutting ||
						(isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y+1) &&
						isTileWalkable(collisionGrid, acceptableTiles, searchNode.x+1, searchNode.y))) {
						
						tilesToSearch.push({ instance: instances[0], searchNode: searchNode, 
							x: 1, y: 1, cost: DIAGONAL_COST * getTileCost(searchNode.x+1, searchNode.y+1)});
					}
				}
				if (searchNode.x < collisionGrid[0].length-1 && searchNode.y > 0) {

					if (allowCornerCutting ||
						(isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y-1) &&
						isTileWalkable(collisionGrid, acceptableTiles, searchNode.x+1, searchNode.y))) {


						tilesToSearch.push({ instance: instances[0], searchNode: searchNode, 
							x: 1, y: -1, cost: DIAGONAL_COST * getTileCost(searchNode.x+1, searchNode.y-1)});
					}
				}
				if (searchNode.x > 0 && searchNode.y < collisionGrid.length-1) {

					if (allowCornerCutting ||
						(isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y+1) &&
						isTileWalkable(collisionGrid, acceptableTiles, searchNode.x-1, searchNode.y))) {


						tilesToSearch.push({ instance: instances[0], searchNode: searchNode, 
							x: -1, y: 1, cost: DIAGONAL_COST * getTileCost(searchNode.x-1, searchNode.y+1)});
					}
				}
			}

			// First sort all of the potential nodes we could search by their cost + heuristic distance.
			tilesToSearch.sort(function(a, b) {
				var aCost = a.cost + getDistance(searchNode.x + a.x, searchNode.y + a.y, instances[0].endX, instances[0].endY)
				var bCost = b.cost + getDistance(searchNode.x + b.x, searchNode.y + b.y, instances[0].endX, instances[0].endY)
				if (aCost < bCost) {
					return -1;
				} else if (aCost === bCost) {
					return 0;
				} else {
					return 1;
				}
			});

			var isDoneCalculating = false;

			// Search all of the surrounding nodes
			for (var i = 0; i < tilesToSearch.length; i++) {
				checkAdjacentNode(tilesToSearch[i].instance, tilesToSearch[i].searchNode, 
					tilesToSearch[i].x, tilesToSearch[i].y, tilesToSearch[i].cost);
				if (tilesToSearch[i].instance.isDoneCalculating === true) {
					isDoneCalculating = true;
					break;
				}
			}

			if (isDoneCalculating) {
				instances.shift();
				continue;
			}

		}
	};

	// Private methods follow
	var checkAdjacentNode = function(instance, searchNode, x, y, cost) {
		var adjacentCoordinateX = searchNode.x+x;
		var adjacentCoordinateY = searchNode.y+y;

		if (pointsToAvoid[adjacentCoordinateX + "_" + adjacentCoordinateY] === undefined) {
			// Handles the case where we have found the destination
			if (instance.endX === adjacentCoordinateX && instance.endY === adjacentCoordinateY) {
				instance.isDoneCalculating = true;
				var path = [];
				var pathLen = 0;
				path[pathLen] = {x: adjacentCoordinateX, y: adjacentCoordinateY};
				pathLen++;
				path[pathLen] = {x: searchNode.x, y:searchNode.y};
				pathLen++;
				var parent = searchNode.parent;
				while (parent!=null) {
					path[pathLen] = {x: parent.x, y:parent.y};
					pathLen++;
					parent = parent.parent;
				}
				path.reverse();
				var ic = instance;
				var ip = path;
				ic.callback(ip);
				return
			}

			if (isTileWalkable(collisionGrid, acceptableTiles, adjacentCoordinateX, adjacentCoordinateY)) {
				var node = coordinateToNode(instance, adjacentCoordinateX, 
					adjacentCoordinateY, searchNode, cost);

				if (node.list === undefined) {
					node.list = EasyStar.Node.OPEN_LIST;
					instance.openList.insert(node);
				} else if (node.list === EasyStar.Node.OPEN_LIST) {
					if (searchNode.costSoFar + cost < node.costSoFar) {
						node.costSoFar = searchNode.costSoFar + cost;
						node.parent = searchNode;
					}
				}
			}
		}
	};

	// Helpers
	var isTileWalkable = function(collisionGrid, acceptableTiles, x, y) {
		for (var i = 0; i < acceptableTiles.length; i++) {
			if (collisionGrid[y][x] === acceptableTiles[i]) {
				return true;
			}
		}

		return false;
	};

	var getTileCost = function(x, y) {
		return pointsToCost[x + '_' + y] || costMap[collisionGrid[y][x]]
	};

	var coordinateToNode = function(instance, x, y, parent, cost) {
		if (instance.nodeHash[x + "_" + y]!==undefined) {
			return instance.nodeHash[x + "_" + y];
		}
		var simpleDistanceToTarget = getDistance(x, y, instance.endX, instance.endY);
		if (parent!==null) {
			var costSoFar = parent.costSoFar + cost;
		} else {
			costSoFar = simpleDistanceToTarget;
		}
		var node = new EasyStar.Node(parent,x,y,costSoFar,simpleDistanceToTarget);
		instance.nodeHash[x + "_" + y] = node;
		return node;
	};

	var getDistance = function(x1,y1,x2,y2) {
		return Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 );
	};
}