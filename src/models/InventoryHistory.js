const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

class InventoryHistory extends Model {}

InventoryHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id'
      },
      comment: 'Reference to the item',
    },
    action: {
      type: DataTypes.ENUM('add', 'reduce', 'set'),
      allowNull: false,
      comment: 'Type of inventory action',
    },
    quantityChange: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Quantity changed (positive for add, negative for reduce)',
    },
    previousQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Quantity before the change',
    },
    newQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Quantity after the change',
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Reason for the inventory change',
    },
    performedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'actors',
        key: 'id'
      },
      comment: 'Admin user ID who performed the action',
    },
  },
  {
    sequelize,
    modelName: 'InventoryHistory',
    tableName: 'inventory_histories',
    timestamps: true,
  }
);

module.exports = InventoryHistory;