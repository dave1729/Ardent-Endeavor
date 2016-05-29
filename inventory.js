function Inventory(spec) {
    this.items = [];
}

Inventory.prototype = Object.create(Inventory.prototype);
Inventory.prototype.constructor = Inventory;

Inventory.prototype.addItem = function (item) {
    if (typeof item === Currency)
    {
        item.use(gm.player);
    }
    else
    {
        this.items.push(item);
    }
}

Inventory.prototype.useItem = function (index, target) {
    let item = this.items[index];
    item.use(target);
    if(item.durability === 0)
    {
        this.items.slice(index, 1);
    }
}

function Item(spec) 
{
    this.name = spec.name;
    this.description = spec.description;
    this.quantity = spec.quantity;
}

Item.prototype = Object.create(Item.prototype);
Item.prototype.constructor = Item;

Item.prototype.use = function (target) {
    this.quantity --;
}

Item.prototype.toString = function (params) {
    return this.name;
}

function Currency(spec)
{
    this.value = spec.value;
    Item.call(this, spec);
}

Currency.prototype = Object.create(Item.prototype);
Currency.prototype.constructor = Currency;

Currency.prototype.use = function (target) {
    target.gold += this.value;
}

Currency.prototype.toString = function (params) {
    return this.value + this.name;
}


function Consumable(spec)
{
    //function pointer to an effects that happen to the user
    this.effects = spec.effects;
    Item.call(this, spec);
}

Consumable.prototype = Object.create(Item.prototype);
Consumable.prototype.constructor = Consumable;

Consumable.prototype.use = function (target)
{
    this.effects.forEach((effect) =>
    {
        effect.activate(target);
    })
}

function Equipment(spec)
{
    this.durability = spec.durability;
    Item.call(this,spec);
}

// Effects

function Effect(spec) {
}

Effect.prototype.activate = function (target) {
    console.log("Please set an effect for this to activate")
}

Effect.prototype = Object.create(Effect.prototype);
Effect.prototype.constructor = Effect;


function RestoreHealth(spec) {
    this.value = spec.value;
}

RestoreHealth.prototype = Object.create(Effect.prototype);
RestoreHealth.prototype.constructor = RestoreHealth;

RestoreHealth.prototype.activate = function (target) {
    target.health += this.value;
}

function inventoryHowTo ()
{
    let inv = new Inventory();
    inv.addItem(new Consumable({name: "Health Potion", description: "Restores 20 health", 
                                quantity: 3, effects: [new RestoreHealth({value: 20})]}));
    // find index when you click on it 
    //second parameter the target to use on afk PlayerUnit
    inv.useItem(0, playerUnit)
}
