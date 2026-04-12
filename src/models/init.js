const Actor = require('./Actor');
const Item = require('./Item');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const InventoryHistory = require('./InventoryHistory');

// Define associations

/**
 * Item-InventoryHistory: One-to-Many (One Item can have multiple inventory history entries)
 */
Item.hasMany(InventoryHistory, {
  foreignKey: 'itemId',
  as: 'inventoryHistory',
  onDelete: 'CASCADE',
});

/**
 * InventoryHistory-Item: One-to-Many (One inventory history entry belongs to one item)
 */
InventoryHistory.belongsTo(Item, {
  foreignKey: 'itemId',
  as: 'item',
});

/**
 * InventoryHistory-Actor: One-to-Many (One inventory history entry is performed by one actor)
 */
InventoryHistory.belongsTo(Actor, {
  foreignKey: 'performedBy',
  as: 'performer',
});

/**
 * Actor-Order: One-to-Many (One actor can have multiple orders)
 */
Actor.hasMany(Order, {
  foreignKey: 'actorId',
  as: 'orders',
  onDelete: 'CASCADE',
});

/**
 * Order-Actor: One-to-Many (One order belongs to one actor)
 */
Order.belongsTo(Actor, {
  foreignKey: 'actorId',
  as: 'customer',
});

/**
 * Order-OrderItem: One-to-Many (One order can have multiple order items)
 */
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'items',
  onDelete: 'CASCADE',
});

/**
 * OrderItem-Order: One-to-Many (One order item belongs to one order)
 */
OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order',
});

/**
 * OrderItem-Item: One-to-Many (One order item belongs to one item)
 */
OrderItem.belongsTo(Item, {
  foreignKey: 'itemId',
  as: 'item',
});

/**
 * Item-OrderItem: One-to-Many (One item can have multiple order items)
 */
Item.hasMany(OrderItem, {
  foreignKey: 'itemId',
  as: 'orderItems',
  onDelete: 'CASCADE',
});

module.exports = {
  Actor,
  Item,
  Order,
  OrderItem,
  InventoryHistory,
};