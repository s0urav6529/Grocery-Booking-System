const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

class OrderItem extends Model {}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
      comment: 'Reference to the order',
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id',
      },
      comment: 'Reference to the item',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Quantity booked for this item',
    },
    unitPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      comment: 'Item price at the time of booking',
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      comment: 'Subtotal for this booked item',
    },
  },
  {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
    timestamps: true,
  }
);

module.exports = OrderItem;
