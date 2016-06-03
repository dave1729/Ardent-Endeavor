function Inventory(spec) {
    this.items = [];
}

Inventory.prototype = Object.create(Inventory.prototype);
Inventory.prototype.constructor = Inventory;

Inventory.prototype.addItem = function (item) {
    if (item instanceof Currency)
    {
        item.use(gm.player);
    }
    else
    {
        let index = this.items.indexOf(item);
        if (index === -1)
        {
            this.items.push(item);
        }
        else
        {
            this.items[index].quantity++;
        }   
    }
}

Inventory.prototype.addItem = function (item, quantity) {
    if (item instanceof Currency)
    {
        item.use(gm.player);
    }
    else if (item.name === "Castle Key") {
    	alert("Adding Door Teleport");
    	gm.em.addEntity(new MapTeleportEvent(1641, 390, 50, 50, 3, 15*TILE_SIZE+TILE_SIZE/2, 28*TILE_SIZE));
    }
    else
    {
        let index = this.items.indexOf(item);
        if (index === -1)
        {
            this.items.push(item);
        }
        else
        {
            this.items[index].quantity += quantity;
        }   
    }
}

Inventory.prototype.useItem = function (index, target) {
//    let item = this.items[index];
    item.use(target);
//    if(item.durability === 0)
//    {
//        this.items.slice(index, 1);
//    }
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
    return this.value + " " + this.name;
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
    Item.prototype.use.call(this, target);
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
    inv.addItem(Inventory.LIBRARY.HEALTH_POTION);
    inv.addItem(Inventory.LIBRARY.HEALTH_POTION, 4);
    // find index when you click on it 
    //second parameter the target to use on afk PlayerUnit
    // inv.useItem(0, playerUnit)
}

// Leave Library done here and it works
Inventory.LIBRARY = {
    HEALTH_POTION: new Consumable({name: "Health Potion", description: "Restores 20 health", 
                                   quantity: 10, effects: [new RestoreHealth({value: 20})]}),
    PIRATE_HAT: new Item({name: "Pirate Hat", description: "A Fancy Pirate Hat", quantity: 1}),
    CASTLE_KEY: new Item({name: "Castle Key", description: "An Old Key", quantity: 1})
}
