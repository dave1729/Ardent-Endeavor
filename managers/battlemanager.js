function BattleManager() {
    this.cursor = new Cursor();
    this.grid = new Grid();
    this.currentBattle = undefined;
}

BattleManager.prototype.createBattle = function () {
    //do some things to create cool battles
    // let spec = {
    //     enemies = []
        
    // }
}
BattleManager.prototype.controls = function () {
    gm.im.currentgroup.addMouse();
    gm.im.currentgroup.addClick();
    gm.im.currentgroup.addRClick();
}

BattleManager.prototype.startBattle = function (spec) {
    this.controls();
    gm.em.addEntity(this.cursor);
    gm.em.addEntity(this.grid);     
}



BattleManager.prototype.update = function () {
    
}

function Battle(spec) {
        
}


