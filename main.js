const testingMode = false;
const sqrtOneHalf = 0.70711;
const dungeonWidth = 2048;
const dungeonHeight = 1920;
const screenToMapRatioX= 0.75;
const screenToMapRatioY= 0.75;

var gm = gm || {};
window.addEventListener('load', () => {
	var canvas = document.getElementById("gameWorld");
	canvas.focus();
	var ctx = canvas.getContext("2d");
	
	var canvasUI = document.getElementById("uiLayer");
	var ctxUI = canvasUI.getContext("2d");
	
	var canvasCollision = document.getElementById("collisionMask");
	var ctxCol = canvasCollision.getContext("2d");
	
	gm = new GameManager(ctx, ctxUI, ctxCol, canvas);
	gm.start();

});