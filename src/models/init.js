const Actor = require('./Actor');
const Item = require('./Item');
const InventoryHistory = require('./InventoryHistory');

// Set up associations
Item.hasMany(InventoryHistory, {
  foreignKey: 'itemId',
  as: 'inventoryHistory',
  onDelete: 'CASCADE',
});

InventoryHistory.belongsTo(Item, {
  foreignKey: 'itemId',
  as: 'item',
});

InventoryHistory.belongsTo(Actor, {
  foreignKey: 'performedBy',
  as: 'performer',
});

module.exports = {
  Actor,
  Item,
  InventoryHistory,
};