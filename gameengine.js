
/**
 * Collision Boxes of entities
 * 
 * @param x left side of hitbox (offset from sprite x)
 * @param y top side of hitbox (offset from sprite y)
 * @param w Width of hitbox (relative to center)
 * @param h Height of hitbox (relative to center)
 */
function CollisionBox(entity, x, y, w, h) {
	this.entity = entity;
	this.offsetX = x;
	this.offsetY = y;
	this.width = w;
	this.height = h;
}
CollisionBox.prototype.getX = function () {
	return (this.entity.x + this.offsetX);
}
CollisionBox.prototype.getY = function () {
	return (this.entity.y + this.offsetY);
}
/* getScreenX() function is for non player entities. */
CollisionBox.prototype.getScreenX = function () {
	return (this.entity.x + this.offsetX) - gm.em.backgroundEntity.x;
}
CollisionBox.prototype.getScreenY = function () {
	return (this.entity.y + this.offsetY) - gm.em.backgroundEntity.y;
}

